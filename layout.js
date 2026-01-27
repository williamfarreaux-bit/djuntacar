/**
 * LAYOUT.JS - Version avec Notifications Dynamiques
 */

let deferredPrompt;

document.addEventListener("DOMContentLoaded", function() {
    injectHeader();
    injectMenu();
    setupPWA();
    checkUnreadMessages(); // Vérification au chargement
    
    if (window.lucide) window.lucide.createIcons();
});

function injectHeader() {
    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="width: 15%; display: flex; justify-content: flex-start;">
            <button onclick="toggleMenu()" class="p-2 -ml-2 active:scale-90 transition-transform">
                <i data-lucide="menu" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>

        <div style="width: 50%; display: flex; justify-content: center; align-items: center;" onclick="window.location.href='index.html'">
            <span class="font-black text-lg text-[#1d4379] uppercase italic tracking-tighter">DJUNTACAR</span>
        </div>

        <div style="width: 35%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
            <button onclick="window.location.href='chat.html'" class="relative p-2 active:scale-90 transition-transform">
                <i data-lucide="message-circle" class="w-7 h-7 text-[#1d4379]"></i>
                <span id="unread-badge" class="hidden absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
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
            height: '70px', background: 'white', position: 'sticky', top: '0', zIndex: '1000', borderBottom: '1px solid #f1f5f9', padding: '0 16px'
        });
    }
}

// LOGIQUE DES NOTIFICATIONS
async function checkUnreadMessages() {
    if (!window.supabase) return;
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    // Compter les messages non lus destinés à l'utilisateur
    // On suppose que sender_id != user.id et is_read == false
    const { count, error } = await sb
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id);

    const badge = document.getElementById('unread-badge');
    if (badge && count > 0) {
        badge.classList.remove('hidden');
    }
}

/* ... Reste des fonctions injectMenu, setupPWA, toggleMenu, handleLogout inchangées ... */
