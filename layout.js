/**
 * DJUNTACAR CORE - LAYOUT SYSTEM
 * Architecture : Injection ciblée et gestion d'état globale.
 */

document.addEventListener("DOMContentLoaded", () => {
    initLayoutSystem();
});

function initLayoutSystem() {
    // 1. Injection des composants globaux
    renderHeader();
    renderMobileMenu();

    // 2. Initialisation des icônes (une seule fois pour le layout)
    if (window.lucide) window.lucide.createIcons();

    // 3. Gestionnaires d'événements globaux
    setupGlobalEvents();

    // 4. Services d'arrière-plan
    try { checkUnreadMessages(); } catch (e) { console.warn("Chat service offline"); }
}

function renderHeader() {
    // CIBLE PRÉCISE : On cherche l'ID spécifique
    const target = document.getElementById('app-header');
    
    if (!target) {
        console.error("CRITICAL: <div id='app-header'> missing in HTML.");
        return;
    }

    // Le contenu du header
    target.innerHTML = `
        <header style="height: 80px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 1000;">
            <div style="width: 30%; display: flex; align-items: center; gap: 8px;">
                <button onclick="toggleMenu()" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="menu" style="color:#1d4379; width:28px; height:28px;"></i>
                </button>
                <div style="position:relative;">
                    <button onclick="toggleLang(event)" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:8px; font-weight:900; font-size:10px; color:#1d4379; display:flex; align-items:center; gap:4px; cursor:pointer;">
                        <span id="current-lang">FR</span> <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                    </button>
                    <div id="lang-dropdown" style="display:none; position:absolute; top:35px; left:0; background:white; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; z-index:5000; min-width:80px;">
                        <div onclick="setLang('FR')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">Français</div>
                        <div onclick="setLang('EN')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">English</div>
                    </div>
                </div>
            </div>

            <div style="width: 40%; display: flex; justify-content: center;" onclick="window.location.href='index.html'">
                <img src="logo.png" alt="DjuntaCar" style="max-height: 40px; object-fit: contain;">
            </div>

            <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
                <button onclick="window.location.href='chat.html'" style="background:none; border:none; padding:4px; position:relative; cursor:pointer;">
                    <i data-lucide="message-circle" style="color:#1d4379; width:26px; height:26px;"></i>
                    <span id="unread-dot" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid white;"></span>
                </button>
                <button onclick="window.location.href='profile.html'" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="user" style="color:#1d4379; width:26px; height:26px;"></i>
                </button>
            </div>
        </header>
    `;
}

function renderMobileMenu() {
    if (document.getElementById('mobile-menu')) return;

    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:5px 0 25px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x" style="color:#94a3b8;"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:12px; font-weight:800; text-transform:uppercase; font-size:12px; color:#1d4379;">
            <a href="index.html" style="display:flex; gap:12px; padding:12px; align-items:center; text-decoration:none; color:inherit;"><i data-lucide="home"></i> Accueil</a>
            <a href="search-car.html" style="display:flex; gap:12px; padding:12px; align-items:center; text-decoration:none; color:inherit;"><i data-lucide="search"></i> Rechercher</a>
            <a href="my-rentals.html" style="display:flex; gap:12px; padding:12px; align-items:center; text-decoration:none; color:inherit;"><i data-lucide="calendar"></i> Locations</a>
            <a href="wallet.html" style="display:flex; gap:12px; padding:12px; align-items:center; text-decoration:none; color:inherit;"><i data-lucide="wallet"></i> Portefeuille</a>
            <a href="profile.html" style="display:flex; gap:12px; padding:12px; align-items:center; text-decoration:none; color:inherit;"><i data-lucide="user"></i> Profil</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:16px; border-radius:12px; font-weight:900; text-transform:uppercase; font-size:11px; display:flex; justify-content:center; gap:8px;">
            <i data-lucide="log-out"></i> Déconnexion
        </button>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// --- LOGIQUE MÉTIER ---

window.toggleMenu = function() {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('menu-overlay');
    const isOpen = m.style.transform === 'translateX(0px)';
    m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
    o.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && window.lucide) lucide.createIcons();
};

window.toggleLang = function(e) {
    e.stopPropagation();
    const d = document.getElementById('lang-dropdown');
    d.style.display = d.style.display === 'block' ? 'none' : 'block';
};

window.setLang = function(l) {
    document.getElementById('current-lang').innerText = l;
    document.getElementById('lang-dropdown').style.display = 'none';
};

function setupGlobalEvents() {
    document.addEventListener('click', (e) => {
        const d = document.getElementById('lang-dropdown');
        if (d && d.style.display === 'block') d.style.display = 'none';
    });
}

window.handleLogout = async function() {
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    await sb.auth.signOut();
    window.location.href = 'login.html';
};

async function checkUnreadMessages() {
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).neq('sender_id', user.id);
    if (count > 0) {
        const d = document.getElementById('unread-dot');
        if (d) d.style.display = 'block';
    }
}
