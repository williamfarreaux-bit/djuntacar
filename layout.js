/**
 * DJUNTACAR - LAYOUT SYSTEM (Correction Menu Langue)
 */

document.addEventListener("DOMContentLoaded", function() {
    // 1. Injection prioritaire
    injectHeader();
    injectMenu();

    // 2. Chargement des icônes
    if (window.lucide) {
        lucide.createIcons();
    }

    // 3. Fonctions annexes
    try { setupPWA(); } catch(e) {}
    try { checkUnreadMessages(); } catch(e) {}

    // 4. Fermeture automatique du menu langue si on clique ailleurs
    document.addEventListener('click', function(e) {
        const langMenu = document.getElementById('lang-menu');
        const langBtn = document.getElementById('lang-btn');
        // Si on clique ailleurs que sur le bouton ou le menu, on ferme
        if (langMenu && langBtn && !langBtn.contains(e.target) && !langMenu.contains(e.target)) {
            langMenu.style.display = 'none';
        }
    });
});

function injectHeader() {
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        document.body.prepend(header);
    }

    header.innerHTML = `
        <div class="header-content">
            <div class="header-left">
                <button onclick="toggleMenu()" class="icon-btn">
                    <i data-lucide="menu" class="icon-lg text-blue"></i>
                </button>
                
                <div style="position: relative;">
                    <button id="lang-btn" onclick="toggleLangMenu(event)" class="lang-btn">
                        <span id="current-lang">FR</span> 
                        <i data-lucide="chevron-down" class="icon-sm"></i>
                    </button>
                    <div id="lang-menu" class="lang-dropdown">
                        <div onclick="changeLang('FR')" class="lang-item">Français</div>
                        <div onclick="changeLang('EN')" class="lang-item">English</div>
                        <div onclick="changeLang('PT')" class="lang-item">Português</div>
                    </div>
                </div>
            </div>

            <div class="header-center" onclick="window.location.href='index.html'">
                <img src="logo.png" alt="DjuntaCar" class="header-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <span class="fallback-logo">DJUNTACAR</span>
            </div>

            <div class="header-right">
                <button onclick="window.location.href='chat.html'" class="icon-btn relative">
                    <i data-lucide="message-circle" class="icon-md text-blue"></i>
                    <span id="unread-badge" class="badge"></span>
                </button>
                <button onclick="window.location.href='profile.html'" class="icon-btn">
                    <i data-lucide="user" class="icon-md text-blue"></i>
                </button>
            </div>
        </div>
    `;

    // INJECTION CSS (Avec le Z-Index corrigé)
    const style = document.createElement('style');
    style.innerHTML = `
        header { height: 80px; background: white; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #f1f5f9; padding: 0 16px; display: block; }
        .header-content { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%; }
        .header-left { width: 30%; display: flex; align-items: center; gap: 8px; }
        .header-center { width: 40%; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .header-right { width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
        .header-logo { max-height: 50px; object-fit: contain; }
        .fallback-logo { display: none; font-weight: 900; color: #1d4379; font-style: italic; font-size: 18px; }
        
        .icon-btn { background: none; border: none; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .text-blue { color: #1d4379; }
        .icon-lg { width: 32px; height: 32px; }
        .icon-md { width: 26px; height: 26px; }
        .icon-sm { width: 12px; height: 12px; }
        .badge { display: none; position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }

        /* CSS DU MENU LANGUE */
        .lang-btn { background: #f8fafc; border: 1px solid #f1f5f9; padding: 6px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; color: #1d4379; display: flex; align-items: center; gap: 4px; cursor: pointer; }
        .lang-dropdown { 
            display: none; 
            position: absolute; 
            top: 40px; left: 0; 
            background: white; 
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            min-width: 90px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
            overflow: hidden;
            z-index: 5000 !important; /* C'EST LA CLÉ DU SUCCÈS */
        }
        .lang-item { padding: 10px 12px; font-size: 11px; font-weight: 700; color: #1d4379; cursor: pointer; border-bottom: 1px solid #f8fafc; }
        .lang-item:hover { background: #f1f5f9; }
        .lang-item:last-child { border-bottom: none; }
    `;
    document.head.appendChild(style);
}

function injectMenu() {
    if (document.getElementById('mobile-menu')) return;
    
    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:5px 0 25px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;" onerror="this.style.display='none'">
            <button onclick="toggleMenu()" class="icon-btn"><i data-lucide="x" class="text-blue"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:15px;">
            <a href="index.html" class="menu-link"><i data-lucide="home"></i> Accueil</a>
            <a href="search-car.html" class="menu-link"><i data-lucide="search"></i> Rechercher</a>
            <a href="my-rentals.html" class="menu-link"><i data-lucide="calendar"></i> Mes Locations</a>
            <a href="wallet.html" class="menu-link"><i data-lucide="wallet"></i> Portefeuille</a>
            <a href="profile.html" class="menu-link"><i data-lucide="user"></i> Profil</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:12px; font-weight:900; text-transform:uppercase; font-size:12px; display:flex; justify-content:center; gap:8px;">
            <i data-lucide="log-out"></i> Déconnexion
        </button>
    </div>
    <style>
        .menu-link { display:flex; align-items:center; gap:12px; text-decoration:none; color:#1d4379; font-weight:800; font-size:13px; padding:10px; border-radius:10px; }
        .menu-link:hover { background: #f1f5f9; }
    </style>`;
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// --- LOGIQUE FONCTIONNELLE ---

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
    if(window.lucide) lucide.createIcons();
};

// Fonction Langue Corrigée
window.toggleLangMenu = function(event) {
    if(event) event.stopPropagation(); // Empêche de fermer immédiatement
    const menu = document.getElementById('lang-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
};

window.changeLang = function(lang) {
    document.getElementById('current-lang').innerText = lang;
    document.getElementById('lang-menu').style.display = 'none';
    
    // Ici, vous ajouteriez la logique réelle de traduction
    // console.log("Langue changée : " + lang);
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
        if (count > 0) {
            const badge = document.getElementById('unread-badge');
            if(badge) badge.style.display = 'block';
        }
    }
}
function setupPWA() {}
