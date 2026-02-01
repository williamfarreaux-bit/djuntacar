/** PAGE: translations.js | VERSION: 1.9.4 */
/** * DESCRIPTION: Dictionnaire global. Définit DjuntaT immédiatement pour 
 * éviter les erreurs de chargement dans les autres fichiers.
 */

const DJUNTA_TRANSLATIONS = {
    fr: {
        "nav_home": "Accueil", "nav_driver": "Chauffeur", "nav_car": "Voiture",
        "nav_rentals": "Mes Locations", "nav_wallet": "Portefeuille", "nav_account": "Mon Compte",
        "btn_logout": "Déconnexion", "btn_add_car": "Ajouter ma voiture", "btn_become_driver": "Devenir chauffeur",
        "footer_terms": "Conditions", "footer_privacy": "Confidentialité",
        "pwa_install_title": "DjuntaCar sur votre écran",
        "pwa_install_text": "Installez l'application pour un accès rapide et fluide.",
        "pwa_install_btn": "Installer", "pwa_install_later": "Plus tard",
        "hero_title": "Louez une voiture au Cap-Vert", "search_placeholder": "Où voulez-vous aller ?",
        "signup_title": "Inscription", "title_profile": "Mon Profil",
        "label_fname": "Prénom", "label_lname": "Nom", "label_email": "Email",
        "msg_error": "Erreur survenue", "msg_success": "Opération réussie !",
        "msg_update_success": "Profil mis à jour !"
    },
    en: {
        "nav_home": "Home", "nav_driver": "Driver", "nav_car": "Car",
        "nav_rentals": "Rentals", "nav_wallet": "Wallet", "nav_account": "My Account",
        "btn_logout": "Logout", "btn_add_car": "Add my car", "btn_become_driver": "Become a driver",
        "footer_terms": "Terms", "footer_privacy": "Privacy",
        "pwa_install_title": "DjuntaCar on your screen",
        "pwa_install_btn": "Install", "pwa_install_later": "Later",
        "hero_title": "Rent a car in Cape Verde", "search_placeholder": "Where to go?"
    },
    pt: {
        "nav_home": "Início", "nav_driver": "Motorista", "nav_car": "Carro",
        "nav_rentals": "Reservas", "nav_wallet": "Carteira", "nav_account": "Minha Conta",
        "btn_logout": "Sair", "btn_add_car": "Adicionar meu carro", "btn_become_driver": "Tornar-se motorista",
        "footer_terms": "Condições", "footer_privacy": "Privacidade",
        "pwa_install_title": "DjuntaCar no seu ecrã",
        "pwa_install_btn": "Instalar", "pwa_install_later": "Depois",
        "hero_title": "Aluguer de carros em Cabo Verde", "search_placeholder": "Para onde quer ir?"
    }
};

window.DjuntaT = (key) => {
    try {
        const lang = DJUNTA_CONFIG.langBrain.current || 'fr';
        return DJUNTA_TRANSLATIONS[lang][key] || key;
    } catch (e) { return key; }
};
