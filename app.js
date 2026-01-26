/**
 * DjuntaCar - Global Application Logic
 * Gestion PWA, Formatage et UI Utilities
 */

// ==================================================
// 1. GESTION PWA (INSTALLATION MOBILE)
// ==================================================
// Essaie d'enregistrer le Service Worker pour rendre l'app installable
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('DjuntaCar PWA: ServiceWorker enregistré');
            })
            .catch(error => {
                console.log('DjuntaCar PWA: Échec SW', error);
            });
    });
}

// ==================================================
// 2. UTILITAIRES DE FORMATAGE
// ==================================================

/**
 * Formate un nombre en Escudo Cap-Verdien (CVE)
 * Ex: 1000 -> "1 000 CVE"
 */
function formatMoney(amount) {
    if (!amount) return '0 CVE';
    return new Intl.NumberFormat('pt-CV', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount) + ' CVE';
}

/**
 * Formate une date au format lisible
 * Ex: "2026-01-24" -> "24 janv. 2026"
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// ==================================================
// 3. SYSTÈME DE NOTIFICATION (TOAST)
// ==================================================
// Remplace les alert() moches par des bulles stylées
// Usage: showToast("Ceci est un test", "success");

function showToast(message, type = 'info') {
    // 1. Créer l'élément HTML
    const toast = document.createElement('div');
    
    // Style de base (Tailwind classes injectées dynamiquement)
    let baseClass = "fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] text-xs font-black uppercase transition-all duration-500 ease-out flex items-center gap-2 translate-y-[-100px] opacity-0";
    
    // Couleurs selon le type
    if (type === 'success') {
        toast.className = `${baseClass} bg-[#22c55e] text-white`;
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
    } else if (type === 'error') {
        toast.className = `${baseClass} bg-[#ef4444] text-white`;
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ${message}`;
    } else {
        toast.className = `${baseClass} bg-[#1d4379] text-white`; // Info (Bleu)
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> ${message}`;
    }

    // 2. Ajouter au corps de la page
    document.body.appendChild(toast);

    // 3. Animation d'entrée (Petit délai pour que le CSS s'applique)
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-100px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // 4. Disparition automatique après 3 secondes
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
        
        // Supprimer du DOM après l'animation
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
