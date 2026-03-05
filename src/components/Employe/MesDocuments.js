// Traduit automatiquement
// src/components/Employe/MesDocuments.js - MES DOCUMENTS POUR EMPLOYÉ
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const MesDocuments = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    titre: '',
    type_document: '',
    fichier: null
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, searchTerm, filterType]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📄 Chargement de mes documents...');
      
      const response = await apiService.getMesDocuments();
      const documentsData = response.results || response || [];
      
      setDocuments(documentsData);
      
    } catch (err) {
      console.error('❌ Erreur chargement documents:', err);
      setError(t('common.erreurChargement') + ' de vos documents');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...documents];

    if (filterType) {
      result = result.filter(d => d.type_document === filterType);
    }

    if (searchTerm) {
      result = result.filter(d =>
        (d.nom || d.titre)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(result);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFormData(prev => ({
        ...prev,
        fichier: file
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFormData.fichier || !uploadFormData.titre || !uploadFormData.type_document) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('chemin_fichier', uploadFormData.fichier);
      formData.append('nom', uploadFormData.titre);
      formData.append('type_document', uploadFormData.type_document);

      await apiService.uploadDocument(formData);
      console.log('✅ Document uploadé avec succès');

      alert('Document uploadé avec succès');
      setShowUploadForm(false);
      setUploadFormData({
        titre: '',
        type_document: '',
        fichier: null
      });
      loadDocuments();
      
    } catch (err) {
      console.error('❌ Erreur upload:', err);
      const errorMessage = err.response?.data?.detail || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Erreur lors de l\'upload du document';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (document) => {
    const fichierUrl = document.chemin_fichier || document.fichier;
    if (fichierUrl) {
      // Si c'est une URL complète, l'ouvrir directement
      if (fichierUrl.startsWith('http')) {
        window.open(fichierUrl, '_blank');
      } else {
        // Sinon, construire l'URL complète
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        window.open(`${baseUrl}${fichierUrl}`, '_blank');
      }
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'CONTRAT': 'Contrat',
      'COTE_NOMINATION': 'Cote de nomination',
      'DIPLÔME': 'Diplôme',
      'CERTIFICAT': 'Certificat',
      'ÉVALUATION': 'Évaluation',
      'CV': 'CV',
      'PHOTO': 'Photo'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      'CONTRAT': '#3b82f6',
      'COTE_NOMINATION': '#8b5cf6',
      'DIPLÔME': '#10b981',
      'CERTIFICAT': '#f59e0b',
      'ÉVALUATION': '#ec4899',
      'CV': '#6366f1',
      'PHOTO': '#14b8a6'
    };
    return colors[type] || '#6b7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <h3 style={{
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Chargement de vos documents
          </h3>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'white'
                }}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
              
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  margin: '0 0 0.5rem 0'
                }}>
                  Mes Documents
                </h1>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Gérez vos documents personnels
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUploadForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#f97316',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Ajouter un document
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
              {documents.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total documents</div>
          </div>
        </div>

        {/* Filtres */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🔍 Rechercher
              </label>
              <input
                type="text"
                placeholder="Titre, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous</option>
                <option value="CONTRAT">Contrat</option>
                <option value="COTE_NOMINATION">Cote de nomination</option>
                <option value="DIPLÔME">Diplôme</option>
                <option value="CERTIFICAT">Certificat</option>
                <option value="ÉVALUATION">Évaluation</option>
                <option value="CV">CV</option>
                <option value="PHOTO">Photo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des documents */}
        {filteredDocuments.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <DocumentTextIcon style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 2rem',
              color: '#e5e7eb'
            }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Aucun document trouvé
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterType
                ? 'Aucun document ne correspond aux critères de recherche'
                : 'Vous n\'avez pas encore de documents'}
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Ajouter votre premier document
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredDocuments.map((document, index) => {
              const typeColor = getTypeColor(document.type_document);

              return (
                <div
                  key={document.id || index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: `${typeColor}15`,
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DocumentTextIcon style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color: typeColor
                      }} />
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: `${typeColor}15`,
                      color: typeColor,
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {getTypeLabel(document.type_document)}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {document.nom || document.titre}
                  </h3>

                  {document.description && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {document.description}
                    </p>
                  )}

                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <ClockIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                    {formatDate(document.date_upload)}
                  </div>

                  {(document.fichier || document.chemin_fichier) && (
                    <button
                      onClick={() => handleDownload(document)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }}
                    >
                      <ArrowDownTrayIcon style={{ width: '1rem', height: '1rem' }} />
                      Télécharger
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Formulaire d'upload */}
      {showUploadForm && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
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
                  margin: 0
                }}>
                  Ajouter un document
                </h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadFormData({
                      titre: '',
                      type_document: '',
                      fichier: null
                    });
                    setError(null);
                  }}
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
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Titre *
                </label>
                <input
                  type="text"
                  value={uploadFormData.titre}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, titre: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Type de document *
                </label>
                <select
                  value={uploadFormData.type_document}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, type_document: e.target.value }))}
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
                  <option value="">Sélectionner un type</option>
                  <option value="CONTRAT">Contrat</option>
                  <option value="COTE_NOMINATION">Cote de nomination</option>
                  <option value="DIPLÔME">Diplôme</option>
                  <option value="CERTIFICAT">Certificat</option>
                  <option value="ÉVALUATION">Évaluation</option>
                  <option value="CV">CV</option>
                  <option value="PHOTO">Photo</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fichier *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
                {uploadFormData.fichier && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#059669',
                    marginTop: '0.5rem'
                  }}>
                    ✓ {uploadFormData.fichier.name}
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadFormData({
                      titre: '',
                      type_document: '',
                      fichier: null
                    });
                    setError(null);
                  }}
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
                  disabled={uploading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: uploading ? '#9ca3af' : '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {uploading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite'
                      }}></div>
                      Upload...
                    </>
                  ) : (
                    <>
                      <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                      Uploader
                    </>
                  )}
                </button>
              </div>
            </form>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesDocuments;

