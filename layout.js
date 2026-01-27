/**
 * LAYOUT AUTOMATIQUE (Version Messagerie + PWA)
 * DjuntaCar 2026
 */

let deferredPrompt;

document.addEventListener("DOMContentLoaded", function() {
    injectHeader();
    injectMenu();
    setupPWA();
    
    if (window.lucide) window.lucide.createIcons();
});

// 1. HEADER (Design Fusionné : Menu | Logo | Messages + Install + User)
function injectHeader() {
    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="width: 15%; display: flex; justify-content: flex-start;">
            <button onclick="toggleMenu()" class="p-2 -ml-2 active:scale-90 transition-transform">
                <i data-lucide="menu" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>

        <div style="width: 50%; display: flex; justify-content: center; align-items: center;" onclick="window.location.href='index.html'">
            <img src="logo.png" alt="DjuntaCar" style="max-height: 35px; object-fit: contain;" onerror="this.outerHTML='<span class=\'font-black text-lg text-[#1d4379] uppercase italic tracking-tighter\'>DJUNTACAR</span>'">
        </div>

        <div style="width: 35%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
            
            <button onclick="window.location.href='chat.html'" class="relative p-2 active:scale-90 transition-transform">
                <i data-lucide="message-circle" class="w-7 h-7 text-[#1d4379]"></i>
                <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <button id="pwa-install-btn" class="hidden bg-blue-50 text-blue-600 p-2 rounded-full active:scale-90 transition-transform">
                <i data-lucide="download-cloud" class="w-5 h-5"></i>
            </button>
            
            <button onclick="window.location.href='profile.html'" class="p-2 -mr-2 active:scale-90 transition-transform">
                <i data-lucide="user" class="w-7 h-7 text-[#1d4379]"></i>
            </button>
        </div>
    </div>`;

    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        Object.assign(headerElement.style, {
            height: '70px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: '0',
            zIndex: '1000',
            borderBottom: '1px solid #f1f5f9',
            padding: '0 16px'
        });
    }
}

// 2. MENU LATÉRAL (Ajout de l'onglet Messages)
function injectMenu() {
    const oldMenu = document.getElementById('mobile-menu');
    if (oldMenu) return; // Évite les injections multiples

    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" class="fixed inset-0 bg-black/50 z-[1999] hidden backdrop-blur-sm transition-opacity"></div>

    <div id="mobile-menu" class="fixed top-0 left-0 bottom-0 w-[85%] max-w-[300px] bg-white z-[2000] p-6 flex flex-col transform -translate-x-full transition-transform duration-300 shadow-2xl">
        <div class="flex justify-between items-center mb-10">
            <span class="font-black text-[#1d4379] text-xl italic uppercase">DJUNTACAR</span>
            <button onclick="toggleMenu()" class="p-2 bg-gray-50 rounded-full text-gray-400">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>
        
        <nav class="space-y-3 flex-1 overflow-y-auto">
            <a href="index.html" class="flex items-center gap-4 text-[11px] font-black text-[#1d4379] uppercase p-3.5 hover:bg-gray-50 rounded-2xl transition-colors">
                <i data-lucide="home" class="w-5 h-5 text-blue-500"></i> Accueil
            </a>
            <a href="chat.html" class="flex items-center gap-4 text-[11px] font-black text-[#1d4379] uppercase p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 transition-colors">
                <i data-lucide="message-square" class="w-5 h-5 text-blue-600"></i> Messages
            </a>
            <a href="my-rentals.html" class="flex items-center gap-4 text-[11px] font-black text-[#1d4379] uppercase p-3.5 hover:bg-gray-50 rounded-2xl transition-colors">
                <i data-lucide="calendar" class="w-5 h-5"></i> Mes Locations
            </a>
            <a href="wallet.html" class="flex items-center gap-4 text-[11px] font-black text-[#1d4379] uppercase p-3.5 hover:bg-gray-50 rounded-2xl transition-colors">
                <i data-lucide="wallet" class="w-5 h-5"></i> Portefeuille
            </a>
            <hr class="border-gray-50 my-2">
            <a href="profile.html" class="flex items-center gap-4 text-[11px] font-black text-[#1d4379] uppercase p-3.5 hover:bg-gray-50 rounded-2xl transition-colors">
                <i data-lucide="user-circle" class="w-5 h-5"></i> Mon Compte
            </a>
        </nav>

        <button onclick="handleLogout()" class="flex items-center gap-3 text-[10px] font-black text-red-500 uppercase w-full p-4 bg-red-50 rounded-2xl mt-4 justify-center active:scale-95 transition-transform">
            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
        </button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// 3. LOGIQUE PWA (Conservée telle quelle)
function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') installBtn.classList.add('hidden');
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
        const isClosed = menu.classList.contains('-translate-x-full');
        if (isClosed) {
            menu.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        } else {
            menu.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }
};

window.handleLogout = async function() {
    if (window.supabase) {
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
        await sb.auth.signOut();
    }
    window.location.href = 'login.html';
};
