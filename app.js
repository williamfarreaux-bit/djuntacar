/** PAGE: app.js | VERSION: 1.9.1 */
/** DESCRIPTION: Utilitaires métier, Toasts et Protection de navigation. */

// 1. Protection du profil (appelé par layout.js après injection)
window.setupProfileProtection = async function() {
    const profileBtn = document.getElementById('nav-profile-trigger');
    if (!profileBtn) return;

    profileBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        // Récupération dynamique de l'instance client
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
        const { data: { session } } = await sb.auth.getSession();

        if (session) {
            window.location.href = 'profile.html';
        } else {
            showToast("Veuillez vous connecter", "error");
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
        }
    });
};

// 2. Système de Toasts Lean
window.showToast = function(message, type = 'info') {
    const toast = document.createElement('div');
    const color = type === 'success' ? '#22c55e' : (type === 'error' ? '#ef4444' : '#1d4379');
    
    toast.style.cssText = `
        position:fixed; top:20px; left:50%; transform:translateX(-50%);
        background:${color}; color:white; padding:12px 24px; border-radius:50px;
        z-index:10000; font-size:10px; font-weight:900; text-transform:uppercase;
        box-shadow:0 10px 30px rgba(0,0,0,0.2); transition:all 0.3s ease;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
};

// 3. Formateurs métier
window.formatMoney = (amount) => {
    return new Intl.NumberFormat('pt-CV').format(amount) + ' CVE';
};

// 4. PWA (Lean)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Error', err));
}
