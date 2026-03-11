/**
 * DjuntaCar - Configuration Centralisée
 * Gère tous les paramètres de l'application
 */

const AppConfig = {
    // Supabase Configuration (chargée depuis les variables d'environnement)
    supabase: {
        url: typeof process !== 'undefined' ? process.env.SUPABASE_URL : (typeof import !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : null),
        key: typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : (typeof import !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : null)
    },

    // Format des devises
    currency: {
        locale: 'pt-CV',
        code: 'CVE',
        maxFractionDigits: 0
    },

    // Paramètres de langue
    i18n: {
        defaultLang: 'fr',
        supportedLangs: ['fr', 'en', 'pt'],
        storageKey: 'djuntacar_lang'
    },

    // Routes et URLs
    routes: {
        home: 'index.html',
        profile: 'profile.html',
        searchCar: 'search-car.html',
        driverApp: 'driver-application.html'
    },

    // Paramètres UI
    ui: {
        primaryColor: '#1d4379',
        primaryLight: '#3b82f6',
        bgPage: '#fcfcfd',
        textDark: '#111827'
    },

    // Logging
    logging: {
        enabled: typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
        level: typeof process !== 'undefined' ? process.env.LOG_LEVEL || 'info' : 'info'
    }
};

// Export pour les navigateurs
window.AppConfig = AppConfig;