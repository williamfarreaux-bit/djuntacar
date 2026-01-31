/**
 * CONFIGURATION OFFICIELLE DJUNTACAR - PRODUCTION
 * Version : 1.6.0 (Global Logic, Multi-Language & Multi-Currency)
 */

const DJUNTA_CONFIG = {
    // 1. ENVIRONNEMENT
    isProduction: window.location.hostname === "djuntacar.com",

    // 2. CONNEXION SUPABASE
    supabase: {
        url: "https://TON_ID_PROJET.supabase.co", 
        anonKey: "TA_CLE_ANON_PUBLIQUE"
    },

    // 3. LE CERVEAU DES LANGUES (i18n)
    langBrain: {
        // Détecte la langue sauvegardée ou utilise le français par défaut
        current: localStorage.getItem('djunta_lang') || 'fr',
        translations: {
            fr: {
                find_driver: "Trouver un Chauffeur",
                search_placeholder: "VILLE OU ÎLE...",
                budget_label: "Tarif Journalier Max (8h)",
                duration_label: "Durée de la course",
                total_text: "Total estimé",
                currency_info: "Prix affichés en"
            },
            pt: {
                find_driver: "Encontrar um Motorista",
                search_placeholder: "CIDADE OU ILHA...",
                budget_label: "Orçamento Diário Máx (8h)",
                duration_label: "Duração da viagem",
                total_text: "Total estimado",
                currency_info: "Preços exibidos em"
            },
            en: {
                find_driver: "Find a Driver",
                search_placeholder: "CITY OR ISLAND...",
                budget_label: "Max Daily Rate (8h)",
                duration_label: "Trip duration",
                total_text: "Estimated total",
                currency_info: "Prices shown in"
            }
        }
    },

    // 4. LE CERVEAU DES DEVISES (Calculs & Taux)
    currencyBrain: {
        current: localStorage.getItem('djunta_curr') || 'EUR',
        rates: {
            'EUR': 1,
            'CVE': 110.265, // Taux fixe Euro/Escudo
            'USD': 1.08
        },
        symbols: {
            'EUR': '€',
            'CVE': 'Esc',
            'USD': '$'
        },
        // Règle métier : minimum 25€ (8h) + 5€/h supplémentaire
        rules: {
            min_base: 25,
            extra_hour: 5,
            base_hours: 8
        }
    },

    // 5. ARCHITECTURE EMAIL (Conservée de votre original)
    emailing: {
        auth: { service: "Resend", sender: "noreply@auth.djuntacar.com", name: "DjuntaCar Sécurité" },
        legal: { service: "Brevo", sender: "contracts@legal.djuntacar.com", name: "DjuntaCar Legal", templateId: 1 },
        info: { service: "Brevo", sender: "contact@info.djuntacar.com", name: "DjuntaCar Info", templateId: 2 },
        support: { service: "Cloudflare", sender: "help@support.djuntacar.com", name: "DjuntaCar Support" }
    },

    // 6. PARAMÈTRES RÉGIONAUX & ROUTES
    settings: {
        timezone: "Atlantic/Cape_Verde",
        brandName: "DjuntaCar",
        supportUrl: "https://support.djuntacar.com"
    },
    routes: {
        home: "/",
        login: "/login",
        profile: "/profile",
        bookings: "/bookings",
        legalTerms: "/legal-terms"
    }
};

Object.freeze(DJUNTA_CONFIG);
window.DJUNTA_CONFIG = DJUNTA_CONFIG;
