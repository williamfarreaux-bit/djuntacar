/**
 * DjuntaCar - Global Application Logic
 * PWA, Formatage, Header JSON & Sécurité Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicHeader();
});

// ==================================================
// 1. GESTION DU HEADER DYNAMIQUE (JSON)
// ==================================================
async function loadDynamicHeader() {
    const headerSlot = document.getElementById('header-slot');
    if (!headerSlot) return;

    try {
        const response = await fetch('header-config.json');
        const menuData = await response.json();

        let navHtml = `<header class="main-header"><nav class="nav-container">`;
        
        menuData.nav_items.forEach(item => {
            // On conserve l'ID pour l'intercepter plus tard
            navHtml += `
                <a href="${item.url}" id="${item.id}" class="nav-link">
                    <img src="${item.icon}" alt="${item.id}" class="nav-icon">
                </a>`;
        });

        navHtml += `</nav></header>`;
        headerSlot.innerHTML = navHtml;

        // Une fois injecté, on protège le bouton profil
        setupProfileProtection();

    } catch (error) {
        console.error("Erreur chargement header:", error);
    }
}

async function setupProfileProtection() {
    // On cible l'ID de l'icône profil défini dans le JSON
    const profileBtn = document.getElementById('nav-profile-trigger');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                window.location.href = 'profile.html';
            } else {
                showToast("Connexion requise pour accéder au profil", "info");
                setTimeout(() => { window.location.href = 'login.html'; }, 800);
            }
        });
    }
}

// ==================================================
// 2. UTILITAIRES DE FORMATAGE & LOGIQUE MÉTIER
// ==================================================
function formatMoney(amount) {
    if (!amount) return '0 CVE';
    return new Intl.NumberFormat('pt-CV', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount) + ' CVE';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function getYearsSince(dateString) {
    if (!dateString) return 0;
    const today = new Date();
    const pastDate = new Date(dateString);
    let diff = today.getFullYear() - pastDate.getFullYear();
    const m = today.getMonth() - pastDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < pastDate.getDate())) { diff--; }
    return diff;
}

// ==================================================
// 3. SYSTÈME DE NOTIFICATION (TOAST)
// ==================================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    let baseClass = "fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] text-xs font-black uppercase transition-all duration-500 ease-out flex items-center gap-2 translate-y-[-100px] opacity-0";
    
    if (type === 'success') {
        toast.className = `${baseClass} bg-[#22c55e] text-white`;
    } else if (type === 'error') {
        toast.className = `${baseClass} bg-[#ef4444] text-white`;
    } else {
        toast.className = `${baseClass} bg-[#1d4379] text-white`;
    }

    toast.innerText = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-100px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Error', err));
    });
}
