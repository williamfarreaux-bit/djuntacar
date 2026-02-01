/** PAGE: translations.js | VERSION: 1.9.7 */
/** * DESCRIPTION: Dictionnaire complet. Centralise les textes de navigation, 
 * de l'accueil et du nouveau système de Popup Modal PWA.
 */

const DJUNTA_TRANSLATIONS = {
    fr: {
        "nav_home": "Accueil",
        "nav_driver": "Chauffeur",
        "nav_car": "Voiture",
        "nav_rentals": "Mes Locations",
        "nav_wallet": "Portefeuille",
        "nav_account": "Mon Compte",
        "btn_logout": "Déconnexion",
        "btn_add_car": "Ajouter ma voiture",
        "btn_become_driver": "Devenir chauffeur",
        "footer_terms": "Conditions",
        "footer_privacy": "Confidentialité",
        "pwa_title": "Installer DjuntaCar",
        "pwa_desc": "Ajoutez l'application à votre écran d'accueil pour une expérience optimale.",
        "pwa_ios_guide": "Appuyez sur le bouton 'Partager' [icon] puis sur 'Sur l'écran d'accueil'.",
        "pwa_btn_install": "Installer maintenant",
        "pwa_btn_close": "Plus tard",
        "hero_title": "Louez une voiture au Cap-Vert",
        "search_placeholder": "Où voulez-vous aller ?",
        "msg_error": "Erreur survenue",
        "msg_success": "Succès !"
    },
    en: {
        "nav_home": "Home",
        "nav_driver": "Driver",
        "nav_car": "Car",
        "nav_rentals": "Rentals",
        "nav_wallet": "Wallet",
        "nav_account": "My Account",
        "btn_logout": "Logout",
        "btn_add_car": "Add my car",
        "btn_become_driver": "Become a driver",
        "footer_terms": "Terms",
        "footer_privacy": "Privacy",
        "pwa_title": "Install DjuntaCar",
        "pwa_desc": "Add to home screen for the best experience.",
        "pwa_ios_guide": "Tap 'Share' [icon] then 'Add to Home Screen'.",
        "pwa_btn_install": "Install Now",
        "pwa_btn_close": "Later",
        "hero_title": "Rent a car in Cape Verde",
        "search_placeholder": "Where to go?"
    },
    pt: {
        "nav_home": "Início",
        "nav_driver": "Motorista",
        "nav_car": "Carro",
        "nav_rentals": "Reservas",
        "nav_wallet": "Carteira",
        "nav_account": "Minha Conta",
        "btn_logout": "Sair",
        "btn_add_car": "Adicionar meu carro",
        "btn_become_driver": "Tornar-se motorista",
        "footer_terms": "Condições",
        "footer_privacy": "Privacidade",
        "pwa_title": "Instalar DjuntaCar",
        "pwa_desc": "Adicione à tela inicial para melhor experiência.",
        "pwa_ios_guide": "Toque em 'Partilhar' [icon] e 'Adicionar ao ecrã principal'.",
        "pwa_btn_install": "Instalar agora",
        "pwa_btn_close": "Depois",
        "hero_title": "Aluguer de carros em Cabo Verde",
        "search_placeholder": "Para onde quer ir?"
    }
};

window.DjuntaT = (key) => {
    try {
        const lang = DJUNTA_CONFIG.langBrain.current || 'fr';
        return DJUNTA_TRANSLATIONS[lang][key] || key;
    } catch (e) { return key; }
};
