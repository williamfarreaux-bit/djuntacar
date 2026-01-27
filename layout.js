/**
 * DJUNTACAR - LAYOUT CENTRALISÉ v2.0
 * Ce script force l'injection du Header et du Menu Burger
 */

document.addEventListener("DOMContentLoaded", function() {
    console.log("DjuntaLayout: Lancement de l'injection...");
    
    // 1. Injection du Header et du Menu
    const headerReady = injectHeader();
    injectMenu();
    
    // 2. Initialisation des composants (sans bloquer)
    if (headerReady) {
        try { setupPWA(); } catch(e) {}
        try { checkUnreadMessages(); } catch(e) {}
    }

    // 3. Activation des icônes Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
});

// --- INJECTION DU HEADER ---
function injectHeader() {
    let headerElement = document.querySelector('header');
    
    // SÉCURITÉ : Si la balise <header> n'existe pas, on la crée de force
    if (!headerElement) {
        console.warn("DjuntaLayout: Balise <header> manquante, création automatique.");
        headerElement = document.createElement('header');
        document.body.prepend(headerElement);
    }

    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="width: 20%; display: flex; justify-content: flex-start;">
            <button onclick="toggleMenu()" style="background:none; border:none; padding:8px; cursor:pointer;">
                <i data-lucide="menu" style="width:30px; height:30px; color:#1d4379;"></i>
            </button>
        </div>

        <div style="width: 50%; display: flex; justify-content: center; align-items: center; cursor:pointer;" onclick="window.location.href='index.html'">
            <span style="font-weight:900; font-style:italic; font-size:18px; color:#1d4379; text-transform:uppercase; letter-spacing:-1px;">DJUNTACAR</span>
        </div>

        <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 5px;">
            <button onclick="window.location.href='chat.html'" style="position:relative; background:none; border:none; padding:8px; cursor:pointer;">
                <i data-lucide="message-circle" style="width:26px; height:26px; color:#1d4379;"></i>
                <span id="unread-badge" style="display:none; position:absolute; top:5px; right:5px; width:10px; height:10px; background:#ef4444; border:2px solid white; border-radius:50%;"></span>
            </button>
            
            <button id="pwa-install-btn" style="display:none; background:#eff6ff; color:#1d4379; border:none; padding:8px; border-radius:50%; cursor:pointer;">
                <i data-lucide="download-cloud" style="width:20px; height:20px;"></i>
            </button>

            <button onclick="window.location.href='profile.html'" style="background:none; border:none; padding:8px; cursor:pointer;">
                <i data-lucide="user" style="width:26px; height:26px; color:#1d4379;"></i>
            </button>
        </div>
    </div>`;

    headerElement.innerHTML = headerHTML;
    
    // Styles forcés (pour écraser tout conflit CSS)
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
    
    return true;
}

// --- INJECTION DU MENU ---
function injectMenu() {
    if (document.getElementById('mobile-menu')) return;

    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(4px);"></div>

    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease-out; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <span style="font-weight:900; color:#1d4379; font-style:italic;">MENU</span>
            <button onclick="toggleMenu()" style="background:#f1f5f9; border:none; padding:8px; border-radius:50%; cursor:pointer;"><i data-lucide="x"></i></button>
        </div>
        
        <nav style="display:flex; flex-direction:column; gap:10px; flex:1;">
            <a href="index.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px; background:#f8fafc;">
                <i data-lucide="home"></i> Accueil
            </a>
            <a href="chat.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;">
                <i data-lucide="message-square"></i> Messages
            </a>
            <a href="my-rentals.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;">
                <i data-lucide="calendar"></i> Mes Locations
            </a>
            <a href="wallet.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;">
                <i data-lucide="wallet"></i> Portefeuille
            </a>
            <hr style="border:none; border-top:1px solid #f1f5f9; margin:10px 0;">
            <a href="profile.html" style="display:flex; align-items:center; gap:12px; padding:15px; text-decoration:none; color:#1d4379; font-size:12px; font-weight:800; text-transform:uppercase; border-radius:15px;">
                <i data-lucide="user"></i> Mon Compte
            </a>
        </nav>

        <button onclick="handleLogout()" style="display:flex; align-items:center; justify-content:center; gap:10px; padding:18px; background:#fef2f2; border:none; color:#ef4444; font-weight:900; border-radius:18px; font-size:11px; text-transform:uppercase; cursor:pointer;">
            <i data-lucide="log-out"></i> Déconnexion
        </button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// --- FONCTIONS DE CONTRÔLE ---
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if (!menu) return;

    const isOpen = menu.style.transform === 'translateX(0px)';
    
    if (!isOpen) {
        menu.style.transform = 'translateX(0px)';
        overlay.style.display = 'block';
    } else {
        menu.style.transform = 'translateX(-100%)';
        overlay.style.display = 'none';
    }
};

window.handleLogout = async function() {
    if (window.supabase) {
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
        await sb.auth.signOut();
    }
    window.location.href = 'login.html';
};

async function checkUnreadMessages() {
    if (!window.supabase || typeof DJUNTA_CONFIG === 'undefined') return;
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).neq('sender_id', user.id);
    if (count > 0) document.getElementById('unread-badge').style.display = 'block';
}

function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.style.display = 'block';
    });
}
