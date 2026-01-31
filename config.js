/**
 * CONFIGURATION OFFICIELLE DJUNTACAR - PRODUCTION
 * Version : 1.6.1 (Harmonisation des libellés d'origine)
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
        current: localStorage.getItem('djunta_lang') || 'fr',
        translations: {
            fr: {
                nav_home: "Accueil",
                nav_driver: "Mon Chauffeur",
                nav_car: "Ma Voiture",
                nav_rentals: "Mes Locations",
                nav_wallet: "Portefeuille",
                nav_account: "Mon Compte",
                logout: "Déconnexion",
                find_driver: "Trouver un Chauffeur",
                search_placeholder: "VILLE OU ÎLE...",
                budget_label: "Tarif Journalier Max (8h)",
                duration_label: "Durée de la course",
                total_text: "Total estimé",
                currency_info: "Prix affichés en"
            },
            pt: {
                nav_home: "Início",
                nav_driver: "Meu Motorista",
                nav_car: "Meu Carro",
                nav_rentals: "Minhas Reservas",
                nav_wallet: "Carteira",
                nav_account: "Minha Conta",
                logout: "Sair",
                find_driver: "Encontrar um Motorista",
                search_placeholder: "CIDADE OU ILHA...",
                budget_label: "Orçamento Diário Máx (8h)",
                duration_label: "Duração da viagem",
                total_text: "Total estimado",
                currency_info: "Preços exibidos em"
            },
            en: {
                nav_home: "Home",
                nav_driver: "My Driver",
                nav_car: "My Car",
                nav_rentals: "My Bookings",
                nav_wallet: "Wallet",
                nav_account: "My Account",
                logout: "Logout",
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
            'CVE': 110.265, 
            'USD': 1.08
        },
        symbols: {
            'EUR': '€',
            'CVE': 'Esc',
            'USD': '$'
        },
        rules: {
            min_base: 25,
            extra_hour: 5,
            base_hours: 8
        }
    },

    // 5. ARCHITECTURE EMAIL
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
