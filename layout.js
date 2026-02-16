/**
 * LAYOUT.JS - Gestion du layout (compatibilité)
 * 
 * Ce fichier est maintenu pour la compatibilité avec certaines pages anciennes.
 */

console.log("⚠️  layout.js chargé (compatibilité)");

// Fonction de compatibilité pour les anciennes pages
if (typeof window.DJUNTA === 'undefined') {
    console.warn("DJUNTA non initialisé. Assurez-vous que djunta-master.js est chargé.");
}
