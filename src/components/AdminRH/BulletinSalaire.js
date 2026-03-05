// src/components/AdminRH/BulletinSalaire.js - AFFICHAGE DU BULLETIN DE SALAIRE AU FORMAT OFFICIEL
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const BulletinSalaire = ({ paieId, onBack, onEdit }) => {
  const { language, t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [paie, setPaie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPaie();
  }, [paieId]);

  const loadPaie = async () => {
    try {
      setLoading(true);
      setError(null);
      const paieData = await apiService.getPaie(paieId);
      setPaie(paieData);
    } catch (err) {
      console.error('Erreur chargement paie:', err);
      setError('Erreur lors du chargement du bulletin');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatMonthYear = (moisAnnee) => {
    if (!moisAnnee) return '';
    const [year, month] = moisAnnee.split('-');
    return `${String(month).padStart(2, '0')}-${year}`;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    return parseFloat(num).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const formatNetAPercevoir = (num) => {
    if (!num && num !== 0) return '-';
    return `***** ${parseFloat(num).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  };

  const getTitreCivilité = (genre) => {
    if (!genre) return '';
    return genre === 'FEMININ' ? t('bulletin.mme') : t('bulletin.mr');
  };

  const formatDateLocale = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isArabic ? 'ar-MA' : 'fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Chargement du bulletin...</div>
      </div>
    );
  }

  if (error || !paie) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>
        {error || 'Bulletin non trouvé'}
      </div>
    );
  }

  const gains = paie.elements?.filter(el => el.type_element === 'GAIN') || [];
  const retenues = paie.elements?.filter(el => el.type_element === 'RETENUE') || [];
  const totalGains = gains.reduce((sum, el) => sum + parseFloat(el.montant || 0), 0);
  const totalRetenues = retenues.reduce((sum, el) => sum + parseFloat(el.montant || 0), 0);
  const netAPercevoir = totalGains - totalRetenues;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem' }} className="bulletin-container">
      {/* Boutons d'action - masqués à l'impression */}
      <div className="no-print" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 2rem', 
        display: 'flex', 
        gap: '1rem'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
          Retour
        </button>
        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <PrinterIcon style={{ width: '1rem', height: '1rem' }} />
          Imprimer
        </button>
        <button
          onClick={() => {
            window.print();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />
          Exporter PDF
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(paieId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#b91c1c',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <PencilIcon style={{ width: '1rem', height: '1rem' }} />
            Modifier
          </button>
        )}
      </div>

      {/* Bulletin de salaire - Format exact de l'image */}
      <div className="bulletin-content" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        '@media print': {
          boxShadow: 'none',
          padding: '0.5rem',
          maxWidth: '100%',
          margin: '0'
        }
      }}>
        {/* En-tête - Format selon langue */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #000',
          paddingBottom: '0.75rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
              {t('bulletin.republique')}
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '0.15rem' }}>
              {t('bulletin.ministere')}
            </div>
            <div style={{ fontSize: '0.7rem' }}>
              {t('bulletin.ecole')}
            </div>
          </div>
          
          {/* Logo de la Mauritanie */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1rem'
          }}>
            <img
              src="/images/logo-rim.png"
              alt="Logo République Islamique de Mauritanie"
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Titre du bulletin */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #000',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: '700' }}>
            {t('bulletin.title')}
          </div>
        </div>

        {/* Mois et matricule - Format selon langue */}
        <div style={{
          marginBottom: '1rem',
          fontSize: '0.7rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div>
            <span style={{ fontWeight: '600' }}>{t('bulletin.month')} </span>
            <span>{formatMonthYear(paie.mois_annee)}</span>
          </div>
        </div>

        <div style={{
          marginBottom: '1.5rem',
          fontSize: '0.7rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div>
            <span style={{ fontWeight: '600' }}>{t('bulletin.matricule')} </span>
            <span>{paie.personne_numero_employe || ''}</span>
          </div>
        </div>

        {/* Informations employé - Format selon langue */}
        <div style={{
          marginBottom: '1.5rem',
          fontSize: '0.7rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.nom')} </span>
              <span>{getTitreCivilité(paie.personne_genre)} {paie.personne_prenom} {paie.personne_nom}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.grade')} </span>
              <span>{paie.grade || ''}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.service')} </span>
              <span>{paie.personne_service || ''}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.echelon')} </span>
              <span>{paie.echelon || ''}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.indice')} </span>
              <span>{paie.indice || ''}</span>
            </div>
            <div>
              <span style={{ fontWeight: '600' }}>{t('bulletin.nbEnfants')} </span>
              <span>{paie.nb_enfants || 0}</span>
            </div>
          </div>
        </div>

        {/* Tableau des éléments - Format exact de l'image */}
        <div style={{ marginBottom: '1.5rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.65rem',
            border: '1px solid #000'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: isArabic ? 'right' : 'left', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.code')}
                </th>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: isArabic ? 'right' : 'left', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.elementsPaie')}
                </th>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'center', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.taux')}
                </th>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'right', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.retenues')}
                </th>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'right', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.gains')}
                </th>
                <th style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'center', fontWeight: '600', fontSize: '0.65rem' }}>
                  {t('bulletin.date')}<br/>
                  <span style={{ fontSize: '0.55rem' }}>{t('bulletin.debut')} / {t('bulletin.fin')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...gains, ...retenues].map((element, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', fontSize: '0.65rem' }}>
                    {element.code}
                  </td>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', fontSize: '0.65rem' }}>
                    {element.libelle}
                  </td>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', textAlign: 'center', fontSize: '0.65rem' }}>
                    {element.taux ? `${parseFloat(element.taux).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', textAlign: 'right', fontSize: '0.65rem' }}>
                    {element.type_element === 'RETENUE' ? formatNumber(element.montant) : '-'}
                  </td>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', textAlign: 'right', fontSize: '0.65rem' }}>
                    {element.type_element === 'GAIN' ? formatNumber(element.montant) : '-'}
                  </td>
                  <td style={{ padding: '0.3rem', border: '1px solid #000', textAlign: 'center', fontSize: '0.65rem' }}>
                    {element.date_debut || element.date_fin ? (
                      <div>
                        <div style={{ fontSize: '0.6rem' }}>{t('bulletin.debut')}: {element.date_debut ? formatDateLocale(element.date_debut) : '-'}</div>
                        <div style={{ fontSize: '0.6rem' }}>{t('bulletin.fin')}: {element.date_fin ? formatDateLocale(element.date_fin) : '-'}</div>
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '700' }}>
                <td colSpan="3" style={{ padding: '0.4rem', border: '1px solid #000', textAlign: isArabic ? 'right' : 'right', fontSize: '0.7rem' }}>
                  {t('bulletin.totalRetenues')}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'right', fontSize: '0.7rem', fontWeight: '700' }}>
                  {formatNumber(totalRetenues)}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #000', textAlign: 'right', fontSize: '0.7rem', fontWeight: '700' }}>
                  {formatNumber(totalGains)}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #000' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Informations de paiement - Format selon langue */}
        <div style={{
          marginBottom: '1.5rem',
          fontSize: '0.7rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.modeReglement')} </span>
              <span>{paie.mode_reglement ? (paie.mode_reglement.includes('Code') ? paie.mode_reglement : `Code ${paie.mode_reglement}`) : ''}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.compteBancaire')} </span>
              <span>{paie.compte_bancaire || ''}</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>
              {t('bulletin.netAPercevoir')} {formatNetAPercevoir(netAPercevoir)}
            </div>
          </div>
        </div>

        {/* NNI et montant imposable - Format selon langue */}
        <div style={{
          fontSize: '0.7rem',
          textAlign: isArabic ? 'right' : 'left',
          direction: isArabic ? 'rtl' : 'ltr'
        }}>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{t('bulletin.nni')} </span>
              <span>{paie.personne_nni || ''}</span>
            </div>
            {paie.montant_imposable_mensuel && (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {t('bulletin.montantImposables')}
                </div>
                <div style={{ marginLeft: '0.75rem' }}>
                  {t('bulletin.mensuel')} {parseFloat(paie.montant_imposable_mensuel).toFixed(3)}
                </div>
                {paie.montant_imposable_progressif && (
                  <div style={{ marginLeft: '0.75rem' }}>
                    {t('bulletin.progressif')} {parseFloat(paie.montant_imposable_progressif).toFixed(3)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          /* Masquer TOUS les en-têtes, nav et footers du site */
          header,
          nav,
          footer,
          [role="banner"],
          [role="navigation"],
          [role="contentinfo"],
          .mauritanian-header,
          .navigation,
          main > header,
          main > nav,
          main > footer {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Masquer tous les éléments parents qui contiennent header/nav/footer */
          body > div > div > header,
          body > div > div > nav,
          body > div > div > footer,
          body > div > header,
          body > div > nav,
          body > div > footer {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Masquer les boutons d'action */
          button,
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Configuration de la page - marges minimales pour maximiser l'espace */
          @page {
            margin: 0.2cm;
            size: A4 portrait;
          }
          
          /* Styles pour le body lors de l'impression */
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Masquer tous les éléments sauf le bulletin */
          body > *:not(.bulletin-container) {
            display: none !important;
          }
          
          /* Ajuster le conteneur du bulletin */
          .bulletin-container {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            box-shadow: none !important;
            background: white !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          
          /* Optimiser la taille du bulletin pour une seule page */
          .bulletin-content {
            padding: 0.3rem !important;
            margin: 0 !important;
            max-width: 100% !important;
            page-break-inside: avoid;
            page-break-after: avoid;
          }
          
          /* Réduire les espacements */
          .bulletin-content > div {
            margin-bottom: 0.3rem !important;
            page-break-inside: avoid;
          }
          
          /* Optimiser le tableau */
          table {
            font-size: 0.55rem !important;
            page-break-inside: avoid;
            width: 100% !important;
          }
          
          table th,
          table td {
            padding: 0.15rem !important;
            font-size: 0.55rem !important;
            line-height: 1.2 !important;
          }
          
          /* Réduire les tailles de police globales */
          .bulletin-content {
            font-size: 0.65rem !important;
          }
          
          .bulletin-content div {
            font-size: 0.65rem !important;
          }
          
          /* Assurer que le bulletin tient sur une seule page */
          .bulletin-content {
            height: auto !important;
            overflow: visible !important;
            page-break-after: avoid !important;
          }
          
          /* Masquer les éléments non essentiels */
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BulletinSalaire;
