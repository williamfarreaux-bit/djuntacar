/**
 * DJUNTACAR - LAYOUT MASTER
 * Gère l'injection du Header, du Menu Mobile et la Navigation Intelligente
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cibler le slot du header
    const headerSlot = document.getElementById('header-slot');
    
    // Si le slot existe, on injecte. Sinon on crée le header en haut du body
    if (headerSlot) {
        injectHeaderContent(headerSlot);
    } else {
        let header = document.createElement('header');
        document.body.prepend(header);
        injectHeaderContent(header);
    }

    // 2. Injecter le menu (caché par défaut)
    injectMobileMenu(); 
    
    // 3. Lancer les icônes et services
    if (window.lucide) window.lucide.createIcons();
    
    try { setupPWA(); } catch(e) {}
    try { checkUnreadMessages(); } catch(e) {}
    
    // Fermeture auto des menus au clic extérieur
    document.addEventListener('click', (e) => {
        const langMenu = document.getElementById('lang-dropdown');
        const langBtn = document.getElementById('lang-btn');
        if (langMenu && langBtn && !langBtn.contains(e.target)) {
            langMenu.style.display = 'none';
        }
    });
});

// --- 1. INJECTION HEADER ---
function injectHeaderContent(targetElement) {
    targetElement.style.position = 'sticky';
    targetElement.style.top = '0';
    targetElement.style.zIndex = '1000';
    targetElement.style.backgroundColor = 'white';
    targetElement.style.borderBottom = '1px solid #f1f5f9';

    // Remplacement de la redirection directe par handleProfileNavigation()
    targetElement.innerHTML = `
        <div style="height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 600px; margin: 0 auto;">
            
            <div style="width: 30%; display: flex; align-items: center; gap: 8px;">
                <button onclick="toggleMenu()" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="menu" style="color:#1d4379; width:28px; height:28px;"></i>
                </button>
                
                <div style="position:relative;">
                    <button id="lang-btn" onclick="toggleLang(event)" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:8px; font-weight:900; font-size:10px; color:#1d4379; display:flex; align-items:center; gap:4px; cursor:pointer;">
                        <span id="current-lang">FR</span> <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                    </button>
                    <div id="lang-dropdown" style="display:none; position:absolute; top:35px; left:0; background:white; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; z-index:5000; min-width:80px;">
                        <div onclick="setLang('FR')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">Français</div>
                        <div onclick="setLang('EN')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">English</div>
                        <div onclick="setLang('PT')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">Português</div>
                    </div>
                </div>
            </div>

            <div style="width: 40%; display: flex; justify-content: center; cursor:pointer;" onclick="window.location.href='index.html'">
                <img src="logo.png" alt="DjuntaCar" style="max-height: 40px; object-fit: contain;" onerror="this.outerHTML='<h1 class=\'text-xl font-black text-[#1d4379]\'>DJUNTACAR</h1>'">
            </div>

            <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
                <button onclick="window.location.href='chat.html'" style="background:none; border:none; padding:4px; position:relative; cursor:pointer;">
                    <i data-lucide="message-circle" style="color:#1d4379; width:26px; height:26px;"></i>
                    <span id="unread-dot" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid white;"></span>
                </button>
                
                <button id="pwa-install-btn" style="display:none; background:#eff6ff; color:#2563eb; border:none; padding:6px; border-radius:50%; cursor:pointer; margin-right:4px;">
                    <i data-lucide="download-cloud" style="width:18px; height:18px;"></i>
                </button>

                <button onclick="handleProfileNavigation(event)" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="user" style="color:#1d4379; width:26px; height:26px;"></i>
                </button>
            </div>
        </div>
    `;
}

// --- 2. INJECTION MENU MOBILE ---
function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    
    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:5px 0 25px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x" style="color:#94a3b8;"></i></button>
        </div>
        
        <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:12px;">
            <a href="index.html" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="home"></i> Accueil
            </a>
            
            <a href="search-driver.html" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="user-check"></i> Mon Chauffeur
            </a>

            <a href="search-car.html" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="car-front"></i> Ma Voiture
            </a>

            <a href="my-rentals.html" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="calendar"></i> Mes Locations
            </a>

            <a href="wallet.html" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="wallet"></i> Portefeuille
            </a>

            <a href="#" onclick="handleProfileNavigation(event)" style="display:flex; gap:12px; align-items:center; text-decoration:none; color:inherit; padding:8px; border-radius:8px;">
                <i data-lucide="user-circle"></i> Mon Compte
            </a>
        </nav>

        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:12px; font-weight:900; text-transform:uppercase; font-size:12px; display:flex; justify-content:center; gap:8px; cursor:pointer;">
            <i data-lucide="log-out"></i> Déconnexion
        </button>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// --- FONCTIONS DE NAVIGATION ET AUTH ---

/**
 * Gère le clic sur le bouton Profil/Compte
 * Vérifie la session Supabase avant de rediriger
 */
window.handleProfileNavigation = async function(e) {
    if(e) e.preventDefault();
    
    if(window.supabase && typeof DJUNTA_CONFIG !== 'undefined') {
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
        const { data: { session } } = await sb.auth.getSession();

        if (session) {
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'login.html';
        }
    } else {
        // Fallback par sécurité vers login
        window.location.href = 'login.html';
    }
};

window.toggleMenu = function() {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('menu-overlay');
    if (!m || !o) return;
    
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

window.handleLogout = async function() {
    if(window.supabase && typeof DJUNTA_CONFIG !== 'undefined') {
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
        await sb.auth.signOut();
    }
    window.location.href = 'login.html';
};

async function checkUnreadMessages() {
    if(!window.supabase || typeof DJUNTA_CONFIG === 'undefined') return;
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
    const { data: { user } } = await sb.auth.getUser();
    if(user) {
        const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).neq('sender_id', user.id);
        if(count > 0) {
            const dot = document.getElementById('unread-dot');
            if(dot) dot.style.display = 'block';
        }
    }
}

function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        const btn = document.getElementById('pwa-install-btn');
        if(btn) {
            btn.style.display = 'block';
            btn.addEventListener('click', async () => {
                if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    const { outcome } = await window.deferredPrompt.userChoice;
                    if (outcome === 'accepted') btn.style.display = 'none';
                    window.deferredPrompt = null;
                }
            });
        }
    });
}
