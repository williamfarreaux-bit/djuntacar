/**
 * CONFIG.JS - Configuration centralisée pour DjuntaCar
 * 
 * Ce fichier est maintenu pour la compatibilité avec certaines pages anciennes.
 * Les nouvelles pages doivent utiliser window.DJUNTA.sb de djunta-master.js
 */

// Configuration Supabase
window.DJUNTA_CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
    
    // Ancienne structure pour compatibilité
    supabase: {
        url: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
        anonKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-"
    }
};
