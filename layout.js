/**
 * LAYOUT.JS - VERSION "NO-FAIL"
 * Utilise des SVG natifs pour garantir l'affichage sans dépendance externe.
 */

document.addEventListener("DOMContentLoaded", function() {
    // 1. On injecte le visuel TOUT DE SUITE
    forceInjectHeader();
    forceInjectMenu();
    
    // 2. On lance les fonctions logiques (si elles échouent, le visuel reste là)
    try { setupPWA(); } catch(e) { console.log('PWA info:', e); }
    try { checkUnreadMessages(); } catch(e) { console.log('Chat info:', e); }
    
    // 3. On active Lucide pour le reste de la page (slider, etc)
    if (window.lucide) window.lucide.createIcons();
});

function forceInjectHeader() {
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        document.body.prepend(header);
    }

    // SVG NATIFS (S'affichent TOUJOURS)
    const iconMenu = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    const iconChat = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
    const iconUser = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`;
    const iconDown = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

    header.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        
        <div style="width: 30%; display: flex; align-items: center; gap: 8px;">
            <button onclick="toggleMenu()" style="background:none; border:none; padding:5px; cursor:pointer;">
                ${iconMenu}
            </button>
            
            <div style="position: relative;">
                <button onclick="toggleLangMenu()" id="lang-btn" style="background:#f1f5f9; border:none; padding:6px 10px; border-radius:8px; font-size:10px; font-weight:900; color:#1d4379; display:flex; align-items:center; gap:4px;">
                    FR ${iconDown}
                </button>
                <div id="lang-menu" style="display:none; position:absolute; top:35px; left:0; background:white; border:1px solid #e2e8f0; border-radius:10px; width:60px; box-shadow:0 10px 20px rgba(0,0,0,0.1); overflow:hidden;">
                    <div onclick="changeLang('FR')" style="padding:8px; font-size:10px; font-weight:bold; color:#1d4379; border-bottom:1px solid #f1f5f9; cursor:pointer;">FR</div>
                    <div onclick="changeLang('EN')" style="padding:8px; font-size:10px; font-weight:bold; color:#1d4379; border-bottom:1px solid #f1f5f9; cursor:pointer;">EN</div>
                    <div onclick="changeLang('PT')" style="padding:8px; font-size:10px; font-weight:bold; color:#1d4379; cursor:pointer;">PT</div>
                </div>
            </div>
        </div>

        <div style="width: 40%; display: flex; justify-content: center;">
            <img src="logo.png" alt="DjuntaCar" style="height: 40px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <span style="display:none; font-weight:900; font-style:italic; color:#1d4379;">DJUNTACAR</span>
        </div>

        <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
            <button onclick="window.location.href='chat.html'" style="position:relative; background:none; border:none; padding:5px;">
                ${iconChat}
                <span id="unread-badge" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:1px solid white;"></span>
            </button>
            <button onclick="window.location.href='profile.html'" style="background:none; border:none; padding:5px;">
                ${iconUser}
            </button>
        </div>
    </div>`;

    // Force le style CSS via JS pour être sûr que rien ne le cache
    Object.assign(header.style, {
        height: '80px',
        backgroundColor: 'white',
        position: 'sticky',
        top: '0',
        zIndex: '9999', // Z-index très haut pour passer devant tout
        borderBottom: '1px solid #f1f5f9',
        padding: '0 16px',
        display: 'block'
    });
}

function forceInjectMenu() {
    if (document.getElementById('mobile-menu')) return;
    
    // SVG X (Fermer)
    const iconX = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9998; display:none;"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:9999; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:5px 0 25px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:30px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;">${iconX}</button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; text-transform:uppercase; color:#1d4379; font-size:12px;">
            <a href="index.html" style="text-decoration:none; color:inherit; padding:10px;">Accueil</a>
            <a href="search-car.html" style="text-decoration:none; color:inherit; padding:10px;">Rechercher</a>
            <a href="my-rentals.html" style="text-decoration:none; color:inherit; padding:10px;">Mes Locations</a>
            <a href="wallet.html" style="text-decoration:none; color:inherit; padding:10px;">Portefeuille</a>
            <a href="profile.html" style="text-decoration:none; color:inherit; padding:10px;">Mon Profil</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:12px; font-weight:900; text-transform:uppercase; font-size:11px;">Déconnexion</button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// FONCTIONS UTILITAIRES
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if(menu.style.transform === 'translateX(0px)') {
        menu.style.transform = 'translateX(-100%)';
        overlay.style.display = 'none';
    } else {
        menu.style.transform = 'translateX(0px)';
        overlay.style.display = 'block';
    }
};

window.toggleLangMenu = function() {
    const m = document.getElementById('lang-menu');
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
};

window.changeLang = function(l) {
    document.getElementById('lang-btn').innerHTML = `${l} <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    document.getElementById('lang-menu').style.display = 'none';
};

window.handleLogout = async function() {
    if (window.supabase) await window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey).auth.signOut();
    window.location.href = 'login.html';
};

async function checkUnreadMessages() {
    if (!window.supabase) return;
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
        const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).neq('sender_id', user.id);
        if (count > 0
