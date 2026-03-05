// Traduit automatiquement
// src/components/Common/CreateAbsenceForm.js - FORMULAIRE DE DEMANDE D'ABSENCE
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  XMarkIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

const CreateAbsenceForm = ({ onClose, onSuccess, personneId = null, personneNom = null }) => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personnes, setPersonnes] = useState([]);
  const [selectedPersonneId, setSelectedPersonneId] = useState(personneId);
  
  const [formData, setFormData] = useState({
    personne: personneId || '',
    type_absence: 'CONGÉ_ANNUEL',
    date_debut: '',
    date_fin: '',
    motif: ''
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [documentFileName, setDocumentFileName] = useState('');

  useEffect(() => {
    // Si c'est un chef de service, charger les personnes de son service
    if (user?.role?.startsWith('chef_') || user?.role === 'admin_rh') {
      loadPersonnes();
    } else {
      // Si c'est un employé, utiliser son propre ID
      if (user?.personne_id) {
        setSelectedPersonneId(user.personne_id);
        setFormData(prev => ({ ...prev, personne: user.personne_id }));
      }
    }
  }, [user]);

  const loadPersonnes = async () => {
    try {
      // Charger selon le type de chef
      let personnesData = [];
      
      if (user?.role === 'chef_enseignant') {
        const response = await apiService.getEnseignants();
        personnesData = response.results || response || [];
      } else if (user?.role === 'chef_pat') {
        const response = await apiService.getPersonnelPAT();
        personnesData = response.results || response || [];
      } else if (user?.role === 'chef_contractuel') {
        const response = await apiService.getContractuels();
        personnesData = response.results || response || [];
      } else if (user?.role === 'admin_rh') {
        // Admin RH peut charger tous les types
        const [enseignants, pat, contractuels] = await Promise.all([
          apiService.getEnseignants(),
          apiService.getPersonnelPAT(),
          apiService.getContractuels()
        ]);
        
        personnesData = [
          ...(enseignants.results || enseignants || []).map(e => ({
            id: e.personne?.id || e.personne_id,
            nom: e.personne?.nom || e.nom,
            prenom: e.personne?.prenom || e.prenom,
            type: 'Enseignant'
          })),
          ...(pat.results || pat || []).map(p => ({
            id: p.personne?.id || p.personne_id,
            nom: p.personne?.nom || p.nom,
            prenom: p.personne?.prenom || p.prenom,
            type: 'PAT'
          })),
          ...(contractuels.results || contractuels || []).map(c => ({
            id: c.personne?.id || c.personne_id,
            nom: c.personne?.nom || c.nom,
            prenom: c.personne?.prenom || c.prenom,
            type: 'Contractuel'
          }))
        ];
      }
      
      setPersonnes(personnesData);
    } catch (err) {
      console.error('Erreur chargement personnes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale : 10 MB');
        e.target.value = '';
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                           'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG, DOC, DOCX');
        e.target.value = '';
        return;
      }
      
      setDocumentFile(file);
      setDocumentFileName(file.name);
      setError(null);
    }
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setDocumentFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validation
      const isChefOrAdmin = user?.role?.startsWith('chef_') || user?.role === 'admin_rh';
      
      // Pour les chefs/admin, la personne doit être sélectionnée
      if (isChefOrAdmin && !formData.personne) {
        setError('Veuillez sélectionner une personne');
        setLoading(false);
        return;
      }

      if (!formData.date_debut || !formData.date_fin) {
        setError('Veuillez remplir les dates de début et de fin');
        setLoading(false);
        return;
      }

      if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
        setError('La date de fin doit être postérieure à la date de début');
        setLoading(false);
        return;
      }

      // Si un document est fourni, utiliser FormData, sinon JSON normal
      if (documentFile) {
        const formDataToSend = new FormData();
        // Pour les employés, ne pas envoyer personne si non défini (backend le gérera)
        if (formData.personne) {
          formDataToSend.append('personne', formData.personne);
        }
        formDataToSend.append('type_absence', formData.type_absence);
        formDataToSend.append('date_debut', formData.date_debut);
        formDataToSend.append('date_fin', formData.date_fin);
        formDataToSend.append('motif', formData.motif || '');
        formDataToSend.append('document_justificatif', documentFile);
        
        await apiService.createAbsence(formDataToSend, true);
      } else {
        const absenceData = {
          // Pour les employés, ne pas envoyer personne si non défini (backend le gérera)
          ...(formData.personne && { personne: formData.personne }),
          type_absence: formData.type_absence,
          date_debut: formData.date_debut,
          date_fin: formData.date_fin,
          motif: formData.motif || ''
        };
        
        await apiService.createAbsence(absenceData);
      }
      
      console.log('✅ Absence créée avec succès');

      alert('Demande d\'absence créée avec succès');
      onSuccess();
      
    } catch (err) {
      console.error('❌ Erreur création absence:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.non_field_errors?.[0] ||
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Erreur lors de la création de la demande d\'absence';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuree = () => {
    if (formData.date_debut && formData.date_fin) {
      const debut = new Date(formData.date_debut);
      const fin = new Date(formData.date_fin);
      const diffTime = fin - debut;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const isChefOrAdmin = user?.role?.startsWith('chef_') || user?.role === 'admin_rh';
  const duree = calculateDuree();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* En-tête */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CalendarDaysIcon style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
              Demander une absence
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Sélection de la personne (si chef ou admin) */}
          {isChefOrAdmin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Employé *
              </label>
              <select
                name="personne"
                value={formData.personne}
                onChange={handleChange}
                required={isChefOrAdmin}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Sélectionner un employé</option>
                {personnes.map(p => {
                  const personneId = p.personne?.id || p.personne_id || p.id;
                  const nomComplet = `${p.personne?.prenom || p.prenom || ''} ${p.personne?.nom || p.nom || ''}`.trim();
                  return (
                    <option key={personneId} value={personneId}>
                      {nomComplet} {p.type ? `(${p.type})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          
          {/* Message informatif pour les employés */}
          {!isChefOrAdmin && user?.role === 'employe' && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#0369a1'
            }}>
              ℹ️ Vous créez une demande d'absence pour vous-même
            </div>
          )}

          {/* Type d'absence */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Type d'absence *
            </label>
            <select
              name="type_absence"
              value={formData.type_absence}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="CONGÉ_ANNUEL">Congé annuel</option>
              <option value="CONGÉ_MALADIE">Congé maladie</option>
              <option value="CONGÉ_MATERNITÉ">Congé maternité</option>
              <option value="CONGÉ_PATERNITÉ">Congé paternité</option>
              <option value="DÉTACHEMENT">Détachement</option>
              <option value="DISPONIBILITÉ">Disponibilité</option>
              <option value="ANNÉE_SABBATIQUE">Année sabbatique</option>
            </select>
          </div>

          {/* Dates */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Date de début *
              </label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Date de fin *
              </label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                required
                min={formData.date_debut || new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Durée calculée */}
          {duree > 0 && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#0369a1',
                marginBottom: '0.25rem'
              }}>
                Durée de l'absence
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0284c7'
              }}>
                {duree} jour{duree > 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Motif */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Motif (optionnel)
            </label>
            <textarea
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              rows="4"
              placeholder="Décrivez la raison de votre demande d'absence..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Document justificatif */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <PaperClipIcon style={{ width: '0.875rem', height: '0.875rem', display: 'inline', marginRight: '0.25rem' }} />
              Document justificatif (optionnel)
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s ease'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.backgroundColor = '#f0fdf4';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#f9fafb';
              const file = e.dataTransfer.files[0];
              if (file) {
                const fakeEvent = { target: { files: [file] } };
                handleFileChange(fakeEvent);
              }
            }}
            >
              {documentFile ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem', color: '#059669' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        {documentFileName}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {(documentFile.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeDocument}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.375rem',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Supprimer le document"
                  >
                    <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <input
                    type="file"
                    id="document-justificatif"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="document-justificatif"
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '1rem'
                    }}
                  >
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PaperClipIcon style={{ width: '1.5rem', height: '1.5rem', color: '#6b7280' }} />
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#059669',
                      fontWeight: '600'
                    }}>
                      Cliquez pour télécharger ou glissez-déposez
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      PDF, DOC, DOCX, JPG, PNG (max 10 MB)
                    </div>
                  </label>
                </div>
              )}
            </div>
            {documentFile && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#059669',
                fontWeight: '500'
              }}>
                ✓ Document sélectionné : {documentFileName}
              </p>
            )}
          </div>

          {/* Boutons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >{t('common.annuler')}</button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }}></div>
                  Envoi...
                </>
              ) : (
                <>
                  <DocumentTextIcon style={{ width: '1rem', height: '1rem' }} />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CreateAbsenceForm;

