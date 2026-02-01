/**
 * CONFIGURATION OFFICIELLE DJUNTACAR
 * Version : 1.7.1 (Logique Système Uniquement)
 */

const DJUNTA_CONFIG = {
    isProduction: window.location.hostname === "djuntacar.com",

    supabase: {
        url: "https://TON_ID_PROJET.supabase.co", 
        anonKey: "TA_CLE_ANON_PUBLIQUE"
    },

    langBrain: {
        // Gère uniquement la langue active
        current: localStorage.getItem('djunta_lang') || 'fr'
    },

    currencyBrain: {
        current: localStorage.getItem('djunta_curr') || 'EUR',
        rates: { 'EUR': 1, 'CVE': 110.265, 'USD': 1.08 },
        symbols: { 'EUR': '€', 'CVE': 'Esc', 'USD': '$' },
        rules: { min_base: 25, extra_hour: 5, base_hours: 8 }
    },

    emailing: {
        auth: { service: "Resend", sender: "noreply@auth.djuntacar.com", name: "DjuntaCar Sécurité" },
        legal: { service: "Brevo", sender: "contracts@legal.djuntacar.com", name: "DjuntaCar Legal", templateId: 1 },
        info: { service: "Brevo", sender: "contact@info.djuntacar.com", name: "DjuntaCar Info", templateId: 2 },
        support: { service: "Cloudflare", sender: "help@support.djuntacar.com", name: "DjuntaCar Support" }
    },

    settings: {
        timezone: "Atlantic/Cape_Verde",
        brandName: "DjuntaCar",
        supportUrl: "https://support.djuntacar.com"
    },

    routes: { home: "/", login: "/login", profile: "/profile", bookings: "/bookings" }
};

Object.freeze(DJUNTA_CONFIG);
window.DJUNTA_CONFIG = DJUNTA_CONFIG;
