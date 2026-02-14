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
     * Hiérarchie stricte: 1) localStorage, 2) Geo-IP, 3) Défaut FR
     */
    init: async function() {
        // 1. PRIORITÉ ABSOLUE: Vérifier localStorage
        const savedLang = localStorage.getItem('djunta_lang');
        
        if (savedLang) {
            this.currentLang = savedLang.toLowerCase();
            console.log(`DjuntaCar i18n: Langue récupérée depuis localStorage [${this.currentLang}]`);
        } else {
            // 2. Sinon, détecter par Geo-IP
            try {
                const res = await fetch('https://ipapi.co/json/').catch(() => null);
                if (res && res.ok) {
                    const data = await res.json();
                    if (data.country_code === 'FR') {
                        this.currentLang = 'fr';
                    } else if (['PT', 'CV'].includes(data.country_code)) {
                        this.currentLang = 'pt';
                    } else {
                        this.currentLang = 'en';
                    }
                    console.log(`DjuntaCar i18n: Langue détectée par IP [${this.currentLang}] (${data.country_code})`);
                } else {
                    // 3. Défaut si échec de détection
                    this.currentLang = 'fr';
                    console.log('DjuntaCar i18n: Détection IP échouée, défaut sur [fr]');
                }
            } catch (e) {
                // 3. Défaut si erreur
                this.currentLang = 'fr';
                console.warn('DjuntaCar i18n: Erreur détection IP, défaut sur [fr]', e);
            }
            // Sauvegarder le choix détecté
            localStorage.setItem('djunta_lang', this.currentLang);
        }
        
        this.apply();
    },

    /**
     * Changer la langue manuellement
     * @param {string} lang - 'fr', 'en', ou 'pt'
     */
    setLanguage: function(lang) {
        this.currentLang = lang.toLowerCase();
        localStorage.setItem('djunta_lang', this.currentLang); // Sauvegarder avec la clé correcte
        console.log(`DjuntaCar i18n: Langue changée manuellement vers [${this.currentLang}]`);
        this.apply(); // Mettre à jour l'affichage
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
document.addEventListener('DOMContentLoaded', async () => {
    await I18n.init();
});
