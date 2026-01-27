/**
 * LAYOUT AUTOMATIQUE (Version Fusionnée)
 * - Injecte le Header (avec bouton Install PWA)
 * - Injecte le Menu Burger (avec vos liens spécifiques)
 * - Gère la logique PWA
 */

let deferredPrompt; // Variable pour stocker l'événement d'installation

document.addEventListener("DOMContentLoaded", function() {
    injectHeader();
    injectMenu();
    setupPWA(); // Initialise l'écouteur pour l'installation
    
    // Initialise les icônes Lucide
    if (window.lucide) window.lucide.createIcons();
});

// 1. HEADER (Design Validé + Bouton Install)
function injectHeader() {
    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="width: 20%; display: flex; justify-content: flex-start;">
            <button onclick="toggleMenu()" class="p-2 -ml-2">
                <i data-lucide="menu" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>

        <div style="width: 60%; display: flex; justify-content: center; align-items: center;">
            <img src="logo.png" alt="DjuntaCar" style="max-height: 40px; object-fit: contain;" onerror="this.outerHTML='<span class=\'font-black text-xl text-[#1d4379] uppercase italic\'>DJUNTACAR</span>'">
        </div>

        <div style="width: 20%; display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
            <button id="pwa-install-btn" class="hidden bg-blue-50 text-blue-600 p-2 rounded-full active:scale-90 transition-transform">
                <i data-lucide="download-cloud" class="w-5 h-5"></i>
            </button>
            
            <button onclick="window.location.href='profile.html'" class="p-2 -mr-2">
                <i data-lucide="user" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>
    </div>`;

    // Cible la balise <header> existante dans le HTML
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        // On applique le style validé directement à la balise header pour garantir le rendu
        headerElement.style.height = '70px';
        headerElement.style.background = 'white';
        headerElement.style.display = 'flex';
        headerElement.style.alignItems = 'center';
        headerElement.style.position = 'sticky';
        headerElement.style.top = '0';
        headerElement.style.zIndex = '1000';
        headerElement.style.borderBottom = '1px solid #f1f5f9';
        headerElement.style.padding = '0 16px';
    }
}

// 2. MENU LATÉRAL (Vos liens conservés)
function injectMenu() {
    // Nettoyage préventif
    const oldMenu = document.getElementById('mobile-menu');
    const oldOverlay = document.getElementById('menu-overlay');
    if (oldMenu) oldMenu.remove();
    if (oldOverlay) oldOverlay.remove();

    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" class="fixed inset-0 bg-black/50 z-[1999] hidden backdrop-blur-sm transition-opacity"></div>

    <div id="mobile-menu" class="fixed top-0 left-0 bottom-0 w-[85%] max-w-[300px] bg-white z-[2000] p-6 flex flex-col transform -translate-x-full transition-transform duration-300 shadow-2xl">
        <div class="flex justify-between items-center mb-10">
            <span class="font-black text-[#1d4379] text-xl italic">DJUNTACAR</span>
            <button onclick="toggleMenu()" class="p-2 bg-gray-50 rounded-full text-gray-400">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>
        
        <nav class="space-y-4 flex-1 overflow-y-auto">
            <a href="index.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="home" class="w-5 h-5"></i> Accueil
            </a>
            <a href="search-driver.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="user-check" class="w-5 h-5"></i> Mon Chauffeur
            </a>
            <a href="search-car.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="car-front" class="w-5 h-5"></i> Louer une voiture
            </a>
            <a href="my-rentals.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="calendar" class="w-5 h-5"></i> Mes Locations
            </a>
            <a href="wallet.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="wallet" class="w-5 h-5"></i> Portefeuille
            </a>
            <a href="profile.html" class="flex items-center gap-4 text-sm font-black text-[#1d4379] uppercase p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <i data-lucide="user-circle" class="w-5 h-5"></i> Mon Compte
            </a>
        </nav>

        <button onclick="handleLogout()" class="flex items-center gap-2 text-xs font-black text-red-500 uppercase w-full p-4 bg-red-50 rounded-xl mt-4 justify-center">
            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
        </button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// 3. LOGIQUE PWA (Installation App)
function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Empêche la bannière par défaut de Chrome
        e.preventDefault();
        deferredPrompt = e;
        
        // Affiche notre bouton personnalisé
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installBtn.classList.add('hidden');
                    }
                    deferredPrompt = null;
                }
            });
        }
    });
}

// 4. FONCTIONS GLOBALES
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu) {
        const isOpen = !menu.classList.contains('-translate-x-full');
        if (isOpen) {
            menu.classList.add('-translate-x-full'); // Fermer
            overlay.classList.add('hidden');
        } else {
            menu.classList.remove('-translate-x-full'); // Ouvrir
            overlay.classList.remove('hidden');
        }
    }
};

window.handleLogout = async function() {
    // Si Supabase est chargé, on déconnecte proprement
    if (window.supabase) {
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
        await sb.auth.signOut();
    }
    window.location.href = 'login.html';
};
