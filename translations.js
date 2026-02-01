/** PAGE: translations.js | VERSION: 2.0.0 */
/** DESCRIPTION: Dictionnaire global multilingue. */

window.DJUNTA_TRANSLATIONS = {
    fr: {
        "nav_home": "Accueil",
        "nav_driver": "Chauffeur",
        "nav_car": "Voiture",
        "nav_rentals": "Mes Locations",
        "nav_wallet": "Portefeuille",
        "nav_account": "Mon Compte",
        "hero_title": "Louez une voiture au Cap-Vert",
        "search_placeholder": "Où voulez-vous aller ?",
        "btn_add_car": "Ajouter ma voiture",
        "btn_become_driver": "Devenir chauffeur",
        "footer_terms": "Conditions Générales (CGU)",
        "footer_privacy": "Politique de Confidentialité"
    },
    en: {
        "nav_home": "Home",
        "nav_driver": "Driver",
        "nav_car": "Cars",
        "nav_rentals": "My Rentals",
        "nav_wallet": "Wallet",
        "nav_account": "My Account",
        "hero_title": "Rent a car in Cape Verde",
        "search_placeholder": "Where do you want to go?",
        "btn_add_car": "Add my car",
        "btn_become_driver": "Become a driver",
        "footer_terms": "Terms of Service",
        "footer_privacy": "Privacy Policy"
    },
    pt: {
        "nav_home": "Início",
        "nav_driver": "Motorista",
        "nav_car": "Carros",
        "nav_rentals": "Alugueres",
        "nav_wallet": "Carteira",
        "nav_account": "Minha Conta",
        "hero_title": "Alugue um carro em Cabo Verde",
        "search_placeholder": "Para onde quer ir?",
        "btn_add_car": "Adicionar carro",
        "btn_become_driver": "Ser motorista",
        "footer_terms": "Termos e Condições",
        "footer_privacy": "Privacidade"
    }
};

window.DjuntaT = function(key) {
    try {
        const lang = (window.DJUNTA_CONFIG && window.DJUNTA_CONFIG.langBrain) ? window.DJUNTA_CONFIG.langBrain.current : 'fr';
        return window.DJUNTA_TRANSLATIONS[lang][key] || key;
    } catch (e) { return key; }
};
