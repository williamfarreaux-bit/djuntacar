/** PAGE: translations.js | VERSION: 3.1.0 */
/** DESCRIPTION: Gestionnaire de langue avec mémoire (localStorage). */

(function() {
    // 1. Définition du Dictionnaire
    const DICTIONARY = {
        pt: {
            "nav_home": "Início", "nav_driver": "Motorista", "nav_car": "Carros",
            "nav_wallet": "Carteira", "nav_account": "Minha Conta",
            "hero_title": "Alugue um carro em Cabo Verde",
            "search_placeholder": "Para onde quer ir?",
            "btn_add_car": "Adicionar carro", "btn_become_driver": "Ser motorista",
            "msg_no_car": "Nenhum veículo disponível", 
            "footer_terms": "Termos", "footer_privacy": "Privacidade",
            "lang_select": "Idioma"
        },
        fr: {
            "nav_home": "Accueil", "nav_driver": "Chauffeur", "nav_car": "Voiture",
            "nav_wallet": "Portefeuille", "nav_account": "Compte",
            "hero_title": "Louez une voiture au Cap-Vert",
            "search_placeholder": "Où voulez-vous aller ?",
            "btn_add_car": "Ajouter ma voiture", "btn_become_driver": "Devenir chauffeur",
            "msg_no_car": "Aucun véhicule", 
            "footer_terms": "Conditions", "footer_privacy": "Confidentialité",
            "lang_select": "Langue"
        },
        en: {
            "nav_home": "Home", "nav_driver": "Driver", "nav_car": "Cars",
            "nav_wallet": "Wallet", "nav_account": "Account",
            "hero_title": "Rent a car in Cape Verde",
            "search_placeholder": "Where to go?",
            "btn_add_car": "Add car", "btn_become_driver": "Become driver",
            "msg_no_car": "No vehicles", 
            "footer_terms": "Terms", "footer_privacy": "Privacy",
            "lang_select": "Language"
        }
    };

    // 2. Détection de la langue (Mémoire > Config > Défaut PT)
    window.currentLang = localStorage.getItem('djunta_lang') || 'pt';

    // 3. Fonction de Traduction Globale
    window.DjuntaT = function(key) {
        const langData = DICTIONARY[window.currentLang] || DICTIONARY['pt'];
        return langData[key] || key;
    };

    // 4. Fonction de Changement de Langue (Reload pour appliquer partout)
    window.setLanguage = function(lang) {
        if (DICTIONARY[lang]) {
            localStorage.setItem('djunta_lang', lang);
            window.location.reload(); // Force le rafraîchissement propre
        }
    };
})();
