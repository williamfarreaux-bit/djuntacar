/**
 * DJUNTACAR - HEADER & NAVIGATION CENTRALE
 * Version avec logo.png, Sélecteur de langue et Messagerie
 */

document.addEventListener("DOMContentLoaded", function() {
    injectDjuntaHeader();
    injectDjuntaMenu();
    
    try { setupPWA(); } catch(e) {}
    try { checkUnreadMessages(); } catch(e) {}
    
    if (window.lucide) lucide.createIcons();
});

function injectDjuntaHeader() {
    let headerElement = document.querySelector('header');
    
    if (!headerElement) {
        headerElement = document.createElement('header');
        document.body.prepend(headerElement);
    }

    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        
        <div style="width: 30%; display: flex; justify-content: flex-start; align-items: center; gap: 8px;">
            <button onclick="toggleMenu()" style="background:none; border:none; padding:5px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="menu" style="width:28px; height:28px; color:#1d4379;"></i>
            </button>
            
            <div style="position: relative; display: inline-block;">
                <button onclick="toggleLangMenu()" id="lang-btn" style="background:#f8fafc; border:1px solid #f1f5f9; padding:5px 8px; border-radius:10px; cursor:pointer; font-size:10px; font-weight:900; color:#1d4379; display:flex; align-items:center; gap:2px; text-transform:uppercase;">
                    FR <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                </button>
                <div id="lang-menu" style="display:none; position:absolute; top:35px; left:0; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); border:1px solid #f1f5f9; z-index:2001; min-width:65px; overflow:hidden;">
                    <button onclick="changeLang('FR')" style="width:100%; padding:12px 10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left; border-bottom:1px solid #f8fafc;">FR</button>
                    <button onclick="changeLang('EN')" style="width:100%; padding:12px 10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left; border-bottom:1px solid #f8fafc;">EN</button>
                    <button onclick="changeLang('PT')" style="width:100%; padding:12px 10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left;">PT</button>
                </div>
            </div>
        </div>

        <div style="width: 40%; display: flex; justify-content: center; align-items: center; cursor:pointer;" onclick="window.location.href='index.html'">
            <img src="logo.png" alt="DjuntaCar" style="max-height: 32px; width: auto; object-fit: contain;">
        </div>

        <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
            <button onclick="window.location.href='chat.html'" style="position:relative; background:none; border:none; padding:8px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="message-circle" style="width:24px; height:24px; color:#1d4379;"></i>
                <span id="unread-badge" style="display:none; position:absolute; top:5px; right:5px; width:10px; height:10px; background:#ef4444; border:2px solid white; border-radius:50%;"></span>
            </button>
            <button onclick="window.location.href='profile.html'" style="background:none; border:none; padding:8px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="user" style="width:24px; height:24px; color:#1d4379;"></i>
            </button>
        </div>
    </div>`;

    headerElement.innerHTML = headerHTML;
    
    Object.assign(headerElement.style, {
        height: '70px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
        borderBottom: '1px solid #f1f5f9',
        padding: '0 16px'
    });
}

// --- LOGIQUE LANGUE ---
window.toggleLangMenu = function() {
    const menu = document.getElementById('lang-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

window.changeLang = function(lang) {
    document.getElementById('lang-btn').innerHTML = `${lang} <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>`;
    document.getElementById('lang-menu').style.display = 'none';
    lucide.createIcons();
};

document.addEventListener('click', (e) => {
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    if (langBtn && !langBtn.contains(e.target)) {
        if (langMenu) langMenu.style.display = 'none';
    }
});

// --- MENU LATÉRAL ---
function injectDjuntaMenu() {
    if (document.getElementById('mobile-menu')) return;
    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(4px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease-out; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" alt="DjuntaCar" style="max-height: 24px;">
            <button onclick="toggleMenu()" style="background:#f1f5f9; border:none; padding:8px; border-radius:50%; cursor:pointer; color:#94a3b8;"><i data-lucide="x"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:10px; flex:1;">
            <a href="index.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px; background:#f8fafc;"><i data-lucide="home"></i> Accueil</a>
            <a href="chat.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;"><i data-lucide="message-square"></i> Messages</a>
            <a href="my-rentals.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;"><i data-lucide="calendar"></i> Mes Locations</a>
            <a href="wallet.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-
