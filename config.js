/**
 * CONFIGURATION OFFICIELLE DJUNTACAR - PRODUCTION
 * Version : 1.3.0 (Multi-Subdomains & Service Mapping)
 */

const DJUNTA_CONFIG = {
    // 1. ENVIRONNEMENT (Détection automatique)
    isProduction: window.location.hostname === "djuntacar.com",

    // 2. CONNEXION SUPABASE
    supabase: {
        url: "https://TON_ID_PROJET.supabase.co", 
        anonKey: "TA_CLE_ANON_PUBLIQUE"
    },

    // 3. ARCHITECTURE EMAIL (Mapping par Service)
    emailing: {
        // Flux Sécurité (Via Resend/Supabase Auth)
        auth: {
            service: "Resend",
            sender: "noreply@auth.djuntacar.com",
            name: "DjuntaCar Sécurité",
            templateId: null // Géré directement dans l'interface Supabase
        },
        // Flux Documents (Via Brevo)
        legal: {
            service: "Brevo",
            sender: "contracts@legal.djuntacar.com",
            name: "DjuntaCar Legal",
            templateId: 1 // À remplacer par l'ID créé dans Brevo
        },
        // Flux Marketing/Info (Via Brevo)
        info: {
            service: "Brevo",
            sender: "contact@info.djuntacar.com",
            name: "DjuntaCar Info",
            templateId: 2 // À remplacer par l'ID créé dans Brevo
        },
        // Flux Support (Via Cloudflare Routing)
        support: {
            service: "Cloudflare",
            sender: "help@support.djuntacar.com",
            name: "DjuntaCar Support"
        }
    },

    // 4. PARAMÈTRES RÉGIONAUX (Cabo Verde)
    settings: {
        currency: "CVE",
        symbol: "Esc",
        timezone: "Atlantic/Cape_Verde",
        brandName: "DjuntaCar",
        supportUrl: "https://support.djuntacar.com"
    },

    // 5. NAVIGATION & ROUTES
    routes: {
        home: "/",
        login: "/login",
        profile: "/profile",
        bookings: "/bookings",
        legalTerms: "/legal-terms"
    }
};

// 6. SÉCURITÉ : Freeze pour empêcher toute modification accidentelle en cours de route
Object.freeze(DJUNTA_CONFIG);

// Exposition globale
window.DJUNTA_CONFIG = DJUNTA_CONFIG;
