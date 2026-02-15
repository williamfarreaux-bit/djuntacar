/**
 * DjuntaCar - Moteur d'Internationalisation (i18n)
 * Gère le changement de langue dynamique (FR, EN, PT)
 * Nécessite le fichier 'translation.js' chargé avant lui.
 */

const I18n = {
    // Langue par défaut
    currentLang: 'fr',

    /**
     * Initialisation au chargement de la page
     */
    init: function() {
        // 1. Vérifier s'il y a une préférence sauvegardée
        const savedLang = localStorage.getItem('djunta_lang');
        
        if (savedLang) {
            this.currentLang = savedLang;
        } else {
            // 2. "France First" - Défaut au français si pas de préférence
            this.currentLang = 'fr'; // Défaut explicite: Français
        }
        
        console.log(`DjuntaCar i18n: Langue définie sur [${this.currentLang}]`);
        this.apply();
    },

    /**
     * Changer la langue manuellement
     * @param {string} lang - 'fr', 'en', ou 'pt'
     */
    setLanguage: function(lang) {
        this.currentLang = lang;
        localStorage.setItem('djunta_lang', lang); // Sauvegarder le choix
        this.apply(); // Mettre à jour l'affichage
        
        // Optionnel : Recharger la page si nécessaire pour certains scripts
        // location.reload(); 
    },

    /**
     * Appliquer les traductions sur le DOM actuel
     */
    apply: function() {
        // Vérification de sécurité : le dictionnaire existe-t-il ?
        if (typeof translations === 'undefined') {
            console.warn("DjuntaCar i18n: Le fichier 'translation.js' est manquant.");
            return;
        }

        const dict = translations[this.currentLang];
        if (!dict) {
            console.error(`DjuntaCar i18n: Aucune traduction trouvée pour [${this.currentLang}]`);
            return;
        }

        // 1. Traduire les textes (attribut data-i18n)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = dict[key];

            if (translation) {
                // Si c'est un input (placeholder)
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } 
                // Si c'est une image (alt text)
                else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } 
                // Texte normal
                else {
                    element.innerHTML = translation; 
                }
            } else {
                console.debug(`Clé manquante : ${key}`);
            }
        });

        // 2. Mettre à jour l'attribut lang du HTML (bon pour le SEO)
        document.documentElement.lang = this.currentLang;
    }
};

// Lancer l'initialisation dès que le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
