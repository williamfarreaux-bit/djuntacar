/**
 * DJUNTACAR - LAYOUT MASTER
 * @version 1.8.1
 * @description Injection Header/Footer, Menu Mobile, Traduction et Services.
 */

console.log("DjuntaCar Layout Loaded - v1.8.1");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fonction de Traduction Globalisée
    window.DjuntaT = (key) => {
        const lang = DJUNTA_CONFIG.langBrain.current;
        if (typeof DJUNTA_TRANSLATIONS !== 'undefined' && DJUNTA_TRANSLATIONS[lang]) {
            return DJUNTA_TRANSLATIONS[lang][key] || key;
        }
        return key;
    };

    // 2. Formateur de Devises
    window.DjuntaFormat = (val, curr) => {
        const brain = DJUNTA_CONFIG.currencyBrain;
        const rate = brain.rates[curr] || 1;
        return `${Math.round(val * rate)} ${brain.symbols[curr]}`;
    };

    // 3. Injection des composants visuels
    const headerSlot = document.getElementById('header-slot') || document.body.prepend(document.createElement('header'));
    injectHeaderContent(document.getElementById('header-slot') || document.querySelector('header'));
    injectMobileMenu(); 
    injectFooter();
    
    // 4. Initialisation Lucide Icons
    if (window.lucide) window.lucide.createIcons();
    
    // 5. Services Système (PWA & Messages)
    try { setupPWA(); checkUnreadMessages(); } catch(e) { console.warn("Layout Services Error:", e); }
    
    // 6. Gestionnaire de clics (Fermeture menus)
    document.addEventListener('click', (e) => {
        const langMenu = document.getElementById('lang-dropdown');
        const langBtn = document.getElementById('lang-btn');
        if (langMenu && langBtn && !langBtn.contains(e.target)) {
            langMenu.style.display = 'none';
        }
    });
});

/**
 * COMPOSANT : HEADER
 */
function injectHeaderContent(targetElement) {
    const langLabel = DJUNTA_CONFIG.langBrain.current.toUpperCase();
    targetElement.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";

    targetElement.innerHTML = `
        <div style="height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 600px; margin: 0 auto;">
            <div style="width: 30%; display: flex; align-items: center; gap: 8px;">
                <button onclick="toggleMenu()" style="background:none; border:none; padding:4px; cursor:pointer;"><i data-lucide="menu" style="color:#1d4379; width:28px;"></i></button>
                <div style="position:relative;">
                    <button id="lang-btn" onclick="toggleLang(event)" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:8px; font-weight:900; font-size:10px; color:#1d4379; cursor:pointer;">
                        <span>${langLabel}</span> <i data-lucide="chevron-down" style="width:10px;"></i>
                    </button>
                    <div id="lang-dropdown" style="display:none; position:absolute; top:35px; left:0; background:white; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); min-width:80px; z-index:1100;">
                        <div onclick="setDjuntaLang('fr')" style="padding:12px; font-size:11px; font-weight:700; cursor:pointer; border-bottom:1px solid #f1f5f9;">Français</div>
                        <div onclick="setDjuntaLang('en')" style="padding:12px; font-size:11px; font-weight:700; cursor:pointer; border-bottom:1px solid #f1f5f9;">English</div>
                        <div onclick="setDjuntaLang('pt')" style="padding:12px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">Português</div>
                    </div>
                </div>
            </div>
            <div style="width: 40%; display: flex; justify-content: center; cursor:pointer;" onclick="window.location.href='index.html'">
                <img src="logo.png" style="max-height: 40px;" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
            </div>
            <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
                <button onclick="window.location.href='chat.html'" style="background:none; border:none; position:relative; cursor:pointer;">
                    <i data-lucide="message-circle" style="color:#1d4379; width:26px;"></i>
                    <span id="unread-dot" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid white;"></span>
                </button>
                <button id="pwa-install-btn" style="display:none; background:#eff6ff; color:#2563eb; border:none; padding:6px; border-radius:50%; cursor:pointer;"><i data-lucide="download-cloud" style="width:18px;"></i></button>
                <button onclick="handleProfileNavigation(event)" style="background:none; border:none; cursor:pointer;"><i data-lucide="user" style="color:#1d4379; width:26px;"></i></button>
            </div>
        </div>
    `;
}

/**
 * COMPOSANT : MENU MOBILE
 */
function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 10px 0 30px rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:12px;">
            <a href="index.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
            <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="user-check"></i> ${DjuntaT('nav_driver')}</a>
            <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
            <a href="my-rentals.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="calendar"></i> ${DjuntaT('nav_rentals')}</a>
            <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="wallet"></i> ${DjuntaT('nav_wallet')}</a>
            <a href="#" onclick="handleProfileNavigation(event)" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_profile')}</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:15px; font-weight:900; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;">
            <i data-lucide="log-out"></i> ${DjuntaT('btn_logout')}
        </button>
    </div>`);
}

/**
 * COMPOSANT : FOOTER
 */
function injectFooter() {
    if (document.getElementById('master-footer')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <footer id="master-footer" style="max-width:500px; margin:40px auto 20px; padding:20px; text-align:center; border-top:1px solid #f1f5f9;">
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-bottom: 15px;">
            <a href="terms.html" style="text-decoration: none; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Conditions</a>
            <a href="privacy.html" style="text-decoration: none; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Confidentialité</a>
        </div>
        <p style="font-size:9px; color:#cbd5e1; font-weight:700; text-transform:uppercase;">© 2026 DjuntaCar • v${DJUNTA_CONFIG.version || '1.8.1'}</p>
    </footer>`);
}

/**
 * LOGIQUE D'INTERFACE
 */
window.toggleMenu = () => {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('menu-overlay');
    if(!m || !o) return;
    const isOpen = m.style.transform === 'translateX(0px)';
    m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
    o.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && window.lucide) lucide.createIcons();
};

window.toggleLang = (e) => { 
    e.stopPropagation(); 
    const d = document.getElementById('lang-dropdown'); 
    if(d) d.style.display = d.style.display === 'block' ? 'none' : 'block'; 
};

window.setDjuntaLang = (l) => { 
    localStorage.setItem('djunta_lang', l); 
    window.location.reload(); 
};

/**
 * AUTH & NAVIGATION
 */
window.handleProfileNavigation = async (e) => {
    if(e) e.preventDefault();
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
    const { data: { session } } = await sb.auth.getSession();
    window.location.href = session ? 'profile.html' : 'login.html';
};

window.handleLogout = async () => { 
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey); 
    await sb.auth.signOut(); 
    window.location.href = 'login.html'; 
};

/**
 * SERVICES BACKEND
 */
async function checkUnreadMessages() {
    if(!window.supabase || typeof DJUNTA_CONFIG === 'undefined') return;
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
    const { data: { user } } = await sb.auth.getUser();
    if(user) {
        const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).neq('sender_id', user.id);
        const dot = document.getElementById('unread-dot');
        if(count > 0 && dot) dot.style.display = 'block';
    }
}

function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); 
        window.deferredPrompt = e;
        const b = document.getElementById('pwa-install-btn'); 
        if(b) b.style.display = 'block';
    });
}
