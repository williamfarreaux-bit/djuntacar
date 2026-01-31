/**
 * DJUNTACAR - LAYOUT MASTER (Intelligence Intégrée)
 * Gère l'injection dynamique, la traduction et les devises via le "Cerveau"
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialisation des aides globales (Traductions & Prix)
    window.DjuntaT = (key) => {
        const brain = DJUNTA_CONFIG.langBrain;
        return brain.translations[brain.current][key] || key;
    };

    window.DjuntaPrice = (amountInEUR, targetCurr) => {
        const brain = DJUNTA_CONFIG.currencyBrain;
        const converted = amountInEUR * brain.rates[targetCurr];
        const symbol = brain.symbols[targetCurr];
        return `${Math.round(converted)} ${symbol}`;
    };

    // 2. Gestion de l'injection du Header
    const headerSlot = document.getElementById('header-slot');
    if (headerSlot) {
        injectHeaderContent(headerSlot);
    } else {
        let header = document.createElement('header');
        document.body.prepend(header);
        injectHeaderContent(header);
    }

    injectMobileMenu(); 
    injectFooter();
    
    // 3. Traduction automatique des éléments marqués [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = DjuntaT(el.getAttribute('data-i18n'));
    });

    if (window.lucide) window.lucide.createIcons();
    
    try { setupPWA(); } catch(e) {}
    try { checkUnreadMessages(); } catch(e) {}
    
    // Fermeture auto des menus
    document.addEventListener('click', (e) => {
        const langMenu = document.getElementById('lang-dropdown');
        const langBtn = document.getElementById('lang-btn');
        if (langMenu && langBtn && !langBtn.contains(e.target)) {
            langMenu.style.display = 'none';
        }
    });
});

// --- 1. INJECTION HEADER (Dynamique) ---
function injectHeaderContent(targetElement) {
    const currentLang = DJUNTA_CONFIG.langBrain.current.toUpperCase();
    const currentCurr = DJUNTA_CONFIG.currencyBrain.current;

    targetElement.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";

    targetElement.innerHTML = `
        <div style="height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 600px; margin: 0 auto;">
            
            <div style="width: 35%; display: flex; align-items: center; gap: 8px;">
                <button onclick="toggleMenu()" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="menu" style="color:#1d4379; width:28px; height:28px;"></i>
                </button>
                
                <div style="position:relative;">
                    <button id="lang-btn" onclick="toggleLang(event)" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:12px; font-weight:900; font-size:9px; color:#1d4379; display:flex; align-items:center; gap:4px; cursor:pointer; text-transform:uppercase;">
                        ${currentLang} | ${currentCurr} <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                    </button>
                    <div id="lang-dropdown" style="display:none; position:absolute; top:40px; left:0; background:white; border:1px solid #e2e8f0; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.1); overflow:hidden; z-index:5000; min-width:120px; padding:8px;">
                        <p style="font-size:8px; font-weight:900; color:#cbd5e1; padding:8px; text-transform:uppercase;">Langue</p>
                        <div onclick="setDjuntaLang('fr')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">Français</div>
                        <div onclick="setDjuntaLang('pt')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">Português</div>
                        <div onclick="setDjuntaLang('en')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">English</div>
                        <hr style="border:0; border-top:1px solid #f1f5f9; margin:4px 0;">
                        <p style="font-size:8px; font-weight:900; color:#cbd5e1; padding:8px; text-transform:uppercase;">Devise</p>
                        <div onclick="setDjuntaCurr('EUR')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">EUR (€)</div>
                        <div onclick="setDjuntaCurr('CVE')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">CVE (Esc)</div>
                    </div>
                </div>
            </div>

            <div style="width: 30%; display: flex; justify-content: center; cursor:pointer;" onclick="window.location.href='index.html'">
                <img src="logo.png" style="max-height:35px;" onerror="this.outerHTML='<h1 style=\'font-weight:900; color:#1d4379; font-size:14px;\'>DJUNTACAR</h1>'">
            </div>

            <div style="width: 35%; display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
                <button onclick="window.location.href='chat.html'" style="background:none; border:none; position:relative; cursor:pointer;">
                    <i data-lucide="message-circle" style="color:#1d4379; width:24px; height:24px;"></i>
                    <span id="unread-dot" style="display:none; position:absolute; top:0; right:0; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid white;"></span>
                </button>
                <button onclick="handleProfileNavigation(event)" style="background:none; border:none; cursor:pointer;">
                    <i data-lucide="user" style="color:#1d4379; width:24px; height:24px;"></i>
                </button>
            </div>
        </div>
    `;
}

// --- 2. INJECTION MENU MOBILE (Traduit) ---
function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:1999; display:none; backdrop-filter:blur(4px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:30px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 40px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
            <img src="logo.png" style="height:30px;">
            <button onclick="toggleMenu()"><i data-lucide="x" style="color:#94a3b8;"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:20px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
            <a href="index.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="home"></i> Accueil</a>
            <a href="find-driver.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="user-check"></i> Chauffeurs</a>
            <a href="search-car.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="car-front"></i> Voitures</a>
            <a href="wallet.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="wallet"></i> Portefeuille</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; padding:18px; border-radius:20px; font-weight:900; text-transform:uppercase; font-size:10px; display:flex; justify-content:center; gap:8px;">
            <i data-lucide="log-out"></i> Déconnexion
        </button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// --- FONCTIONS DU CERVEAU ---
window.setDjuntaLang = function(l) {
    localStorage.setItem('djunta_lang', l);
    window.location.reload();
};

window.setDjuntaCurr = function(c) {
    localStorage.setItem('djunta_curr', c);
    window.location.reload();
};

window.toggleLang = function(e) {
    e.stopPropagation();
    const d = document.getElementById('lang-dropdown');
    d.style.display = d.style.display === 'block' ? 'none' : 'block';
};

window.toggleMenu = function() {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('menu-overlay');
    const isOpen = m.style.transform === 'translateX(0px)';
    m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
    o.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && window.lucide) lucide.createIcons();
};

window.handleProfileNavigation = async function(e) {
    if(e) e.preventDefault();
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
    const { data: { session } } = await sb.auth.getSession();
    window.location.href = session ? 'profile.html' : 'login.html';
};

window.handleLogout = async function() {
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
    await sb.auth.signOut();
    window.location.href = 'login.html';
};

function injectFooter() {
    if (document.getElementById('master-footer')) return;
    const footerHTML = `
    <footer id="master-footer" style="max-width:500px; margin:60px auto 20px; padding:20px; text-align:center; border-top:1px solid #f1f5f9;">
        <p style="font-size:9px; color:#cbd5e1; font-weight:800; text-transform:uppercase;">
            © 2026 DjuntaCar • Cabo Verde
        </p>
    </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}
