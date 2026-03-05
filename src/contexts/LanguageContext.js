import React, { createContext, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    // Navigation et interface
    nav: {
      dashboard: 'Dashboard',
      enseignants: 'Enseignants',
      personnelPAT: 'Personnel PAT',
      contractuels: 'Contractuels',
      services: 'Services',
      utilisateurs: 'Utilisateurs',
      absences: 'Absences',
      paies: 'Paies',
      mesEnseignants: 'Mes Enseignants',
      gestionAbsences: 'Gestion Absences',
      rapportsService: 'Rapports Service',
      monPersonnelPAT: 'Mon Personnel PAT',
      gestionContrats: 'Gestion Contrats',
      monProfil: 'Mon Profil',
      mesAbsences: 'Mes Absences',
      mesDocuments: 'Mes Documents',
      monEquipe: 'Mon Équipe',
      accueil: 'Accueil',
      deconnexion: 'Déconnexion'
    },
    dashboard: {
      chefContractuel: 'Dashboard Chef Service Contractuel',
      bienvenue: 'Bienvenue',
      totalContractuels: 'Total Contractuels',
      absencesEnAttente: 'Absences en attente',
      contratsExpirant: 'Contrats expirant',
      aTraiter: 'À traiter',
      toutTraite: 'Tout traité',
      aRenouveler: 'À renouveler',
      aucun: 'Aucun',
      actionsRapides: 'Actions rapides',
      creerContractuel: 'Créer Contractuel',
      voirTousContractuels: 'Voir tous les contractuels',
      gererAbsences: 'Gérer les absences',
      repartitionTypeContrat: 'Répartition par type de contrat',
      bonjourApercu: 'Bonjour {name}, voici un aperçu de votre activité',
      role: 'Rôle',
      derniereConnexion: 'Dernière connexion',
      statut: 'Statut',
      enLigne: 'En ligne',
      utilisateurConnecte: 'Utilisateur connecté',
      bienvenueEspaceTravail: 'Bienvenue dans votre espace de travail !',
      heureActuelle: 'Heure actuelle',
      adminRH: 'Dashboard Administrateur RH',
      chefEnseignant: 'Dashboard Chef Service Enseignant',
      chefPAT: 'Dashboard Chef Service PAT',
      employe: 'Dashboard Employé',
      descriptionAdminRH: 'Gérez l\'ensemble des ressources humaines et supervisez tous les services.',
      descriptionChefEnseignant: 'Supervisez votre équipe enseignante et gérez les activités pédagogiques.',
      descriptionChefPAT: 'Coordonnez les activités du personnel administratif et technique.',
      descriptionChefContractuel: 'Gérez les ressources contractuelles et les projets spéciaux.',
      descriptionEmploye: 'Accédez à vos informations personnelles et soumettez vos demandes.'
    },
    // Pages et sections
    pages: {
      gestionPaie: 'Gestion de la paie',
      listePaies: 'Liste des paies',
      nouvellePaie: 'Nouvelle paie',
      listeEnseignants: 'Liste des enseignants',
      listePAT: 'Liste du personnel PAT',
      listeContractuels: 'Liste des contractuels',
      listeServices: 'Liste des services',
      gestionUtilisateurs: 'Gestion des utilisateurs',
      gestionAbsences: 'Gestion des absences',
      mesAbsences: 'Mes absences',
      monProfil: 'Mon profil',
      mesDocuments: 'Mes documents',
      rapports: 'Rapports',
      creerEnseignant: 'Créer un enseignant',
      creerPAT: 'Créer un agent PAT',
      creerContractuel: 'Créer un contractuel',
      creerService: 'Créer un service',
      creerUtilisateur: 'Créer un utilisateur',
      modifierEnseignant: 'Modifier l\'enseignant',
      modifierPAT: 'Modifier l\'agent PAT',
      modifierContractuel: 'Modifier le contractuel',
      modifierService: 'Modifier le service',
      modifierUtilisateur: 'Modifier l\'utilisateur',
      modifierPaie: 'Modifier la paie',
      detailsPaie: 'Détails de la paie',
      bulletinSalaire: 'Bulletin de salaire',
      informationsPersonnelles: 'Informations personnelles',
      informationsProfessionnelles: 'Informations professionnelles',
      informationsAcademiques: 'Informations académiques',
      informationsConnexion: 'Informations de connexion'
    },
    header: {
      systemeGestionRH: 'Système de Gestion des Ressources Humaines',
      ministere: 'Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique',
      devise: 'Honneur - Fraternité - Justice'
    },
    // Actions communes
    common: {
      creer: 'Créer',
      modifier: 'Modifier',
      supprimer: 'Supprimer',
      enregistrer: 'Enregistrer',
      annuler: 'Annuler',
      valider: 'Valider',
      confirmer: 'Confirmer',
      rechercher: 'Rechercher',
      filtrer: 'Filtrer',
      voir: 'Voir',
      retour: 'Retour',
      imprimer: 'Imprimer',
      exporter: 'Exporter',
      exporterPDF: 'Exporter PDF',
      sauvegarder: 'Sauvegarder',
      enregistrement: 'Enregistrement...',
      chargement: 'Chargement...',
      erreur: 'Erreur',
      succes: 'Succès',
      oui: 'Oui',
      non: 'Non',
      fermer: 'Fermer',
      suivant: 'Suivant',
      precedent: 'Précédent',
      terminer: 'Terminer',
      details: 'Détails',
      liste: 'Liste',
      aucunResultat: 'Aucun résultat trouvé',
      aucunDonnee: 'Aucune donnée disponible',
      total: 'Total',
      actions: 'Actions',
      statut: 'Statut',
      date: 'Date',
      nom: 'Nom',
      prenom: 'Prénom',
      email: 'Email',
      telephone: 'Téléphone',
      adresse: 'Adresse',
      service: 'Service',
      role: 'Rôle',
      actif: 'Actif',
      inactif: 'Inactif',
      enCours: 'En cours',
      paye: 'Payé',
      suspendu: 'Suspendu',
      annule: 'Annulé',
      enAttente: 'En attente',
      approuve: 'Approuvé',
      refuse: 'Refusé',
      tousMois: 'Tous les mois',
      tousStatuts: 'Tous les statuts',
      filtres: 'Filtres',
      rechercherPar: 'Rechercher par nom, prénom ou service...',
      paieEnregistree: 'paie enregistrée',
      paiesEnregistrees: 'paies enregistrées',
      supprimerPaie: 'Êtes-vous sûr de vouloir supprimer cette paie ? Cette action est irréversible.',
      paieSupprimee: 'Paie supprimée avec succès',
      erreurSuppression: 'Erreur lors de la suppression de la paie',
      erreurChargement: 'Erreur lors du chargement',
      employe: 'Employé',
      mois: 'Mois',
      salaireBrut: 'Salaire brut',
      deductions: 'Déductions',
      allocations: 'Allocations',
      salaireNet: 'Salaire net',
      aucunePaie: 'Aucune paie trouvée',
      aucunePaieCritere: 'Aucune paie ne correspond aux critères de recherche',
      creerPremierePaie: 'Commencez par créer votre première paie',
      nouvellePaie: 'Nouvelle paie',
      creerNouvellePaie: 'Créer une nouvelle fiche de paie avec calcul automatique',
      paieCreee: 'Paie créée avec succès !',
      veuillezSelectionnerEmploye: 'Veuillez sélectionner un employé',
      veuillezAjouterElement: 'Veuillez ajouter au moins un élément de paie',
      salaireBrutSuperieurZero: 'Le salaire brut doit être supérieur à 0',
      veuillezCalculerPaie: 'Veuillez calculer la paie avant de soumettre',
      veuillezRemplirChamps: 'Veuillez remplir tous les champs requis pour chaque élément (Code, Libellé, Montant)',
      veuillezCalculerPaieValide: 'Veuillez calculer la paie avec un salaire brut valide',
      erreurChargementEmployes: 'Erreur lors du chargement des employés',
      erreurCreationPaie: 'Erreur lors de la création de la paie',
      erreurCreationPaieConnexion: 'Erreur lors de la création de la paie. Vérifiez votre connexion.',
      calculer: 'Calculer',
      calculerPaie: 'Calculer la paie',
      informationsEmploye: 'Informations de l\'employé',
      informationsPaie: 'Informations de la paie',
      calculAutomatique: 'Calcul automatique',
      elementsManuels: 'Éléments manuels',
      ajouterGain: 'Ajouter un gain',
      ajouterRetenue: 'Ajouter une retenue',
      code: 'Code',
      libelle: 'Libellé',
      type: 'Type',
      montant: 'Montant',
      dateDebut: 'Date de début',
      dateFin: 'Date de fin',
      nombreEnfants: 'Nombre d\'enfants',
      modeReglement: 'Mode de règlement',
      compteBancaire: 'Compte bancaire',
      montantImposableMensuel: 'Montant imposable mensuel',
      montantImposableProgressif: 'Montant imposable progressif'
    },
    // Bulletin de salaire
    bulletin: {
      title: 'Bulletin de solde',
      month: 'du mois de:',
      matricule: 'Matricule:',
      nom: 'Nom:',
      grade: 'Grade:',
      service: 'Service:',
      echelon: 'Echelon:',
      indice: 'Indice:',
      nbEnfants: 'Nbr Enfants:',
      code: 'Code',
      elementsPaie: 'Eléments de paie',
      taux: 'Taux',
      retenues: 'Retenues',
      gains: 'Gains',
      date: 'Date',
      debut: 'Debut',
      fin: 'Fin',
      totalRetenues: 'Total Retenues',
      modeReglement: 'Mode de réglement:',
      compteBancaire: 'Banque Maurit. Commer. Int. N° Compte',
      netAPercevoir: 'Net à percevoir:',
      nni: 'NNI:',
      montantImposables: 'MONTANT IMPOSABLES:',
      mensuel: 'mensuel:',
      progressif: 'progressif:',
      republique: 'REPUBLIQUE ISLAMIQUE DE MAURITANIE',
      ministere: 'Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique',
      ecole: 'ECOLE NORMALE SUPERIEURE',
      mme: 'Mme',
      mr: 'Mr'
    }
  },
};

export function LanguageProvider({ children }) {
  const language = 'fr';

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations.fr;
    for (const k of keys) {
      value = value?.[k];
    }
    if (!value || value === key) return key;

    // Remplacer les variables dans la chaîne (ex: {name})
    if (params && typeof value === 'string') {
      Object.keys(params).forEach(paramKey => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return value;
  };

  const contextValue = {
    language,
    setLanguage: () => { },
    toggleLanguage: () => { },
    t,
    isArabic: false,
    isFrench: true
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  }
  return context;
}

export default LanguageContext;
