/**
 * DJUNTACAR - LAYOUT MASTER V1.9.0
 * Injection Header, Footer et Logique i18n/Currency
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialisation des outils du Cerveau
    window.DjuntaT = (k) => DJUNTA_CONFIG.langBrain.translations[DJUNTA_CONFIG.langBrain.current][k] || k;
    
    window.DjuntaFormat = (val, curr) => {
        const brain = DJUNTA_CONFIG.currencyBrain;
        const symbol = brain.symbols[curr];
        // Note: Si la base du chauffeur est différente de la base client, conversion nécessaire ici
        return `${Math.round(val)} ${symbol}`;
    };

    // Injection
    const headerSlot = document.getElementById('header-slot') || document.body.prepend(document.createElement('header'));
    injectHeaderContent(document.getElementById('header-slot') || document.querySelector('header'));
    injectMobileMenu();
    injectFooter();

    if (window.lucide) window.lucide.createIcons();

    // Fermeture des menus
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
    });
});

function injectHeaderContent(target) {
    const lang = DJUNTA_CONFIG.langBrain.current.toUpperCase();
    const curr = DJUNTA_CONFIG.currencyBrain.current;

    target.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
    target.innerHTML = `
        <div style="height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 600px; margin: 0 auto;">
            
            <div style="display: flex; align-items: center; gap: 8px; width: 35%;">
                <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;">
                    <i data-lucide="menu" style="color:#1d4379; width:22px;"></i>
                </button>
                
                <div style="position:relative;" onclick="event.stopPropagation()">
                    <button onclick="showDrop('lang-drop')" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 8px; border-radius:10px; font-weight:900; font-size:9px; color:#1d4379; display:flex; gap:4px; align-items:center;">
                        <i data-lucide="globe" style="width:10px;"></i> ${lang}
                    </button>
                    <div id="lang-drop" class="dropdown-content" style="display:none; position:absolute; top:35px; left:0; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); border:1px solid #f1f5f9; min-width:110px;">
                        <div onclick="setDjuntaLang('fr')" style="padding:12px; font-size:11px; font-weight:700; color:#1d4379;">Français</div>
                        <div onclick="setDjuntaLang('pt')" style="padding:12px; font-size:11px; font-weight:700; color:#1d4379;">Português</div>
                        <div onclick="setDjuntaLang('en')" style="padding:12px; font-size:11px; font-weight:700; color:#1d4379;">English</div>
                    </div>
                </div>
            </div>

            <div style="width: 30%; display: flex; justify-content: center;" onclick="window.location.href='index.html'">
                <img src="logo.png" style="max-height:28px;" onerror="this.outerHTML='<b style=\'color:#1d4379; font-size:12px\'>DJUNTA</b>'">
            </div>

            <div style="display: flex; align-items: center; gap: 8px; width: 35%; justify-content: flex-end;">
                <div style="position:relative;" onclick="event.stopPropagation()">
                    <button onclick="showDrop('curr-drop')" style="background:#f0f9ff; border:1px solid #e0f2fe; padding:6px 8px; border-radius:10px; font-weight:900; font-size:9px; color:#0369a1; display:flex; gap:4px; align-items:center;">
                        ${curr}
                    </button>
                    <div id="curr-drop" class="dropdown-content" style="display:none; position:absolute; top:35px; right:0; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); border:1px solid #f1f5f9; min-width:90px;">
                        <div onclick="setDjuntaCurr('CVE')" style="padding:12px; font-size:11px; font-weight:700; color:#0369a1;">CVE (Esc)</div>
                        <div onclick="setDjuntaCurr('EUR')" style="padding:12px; font-size:11px; font-weight:700; color:#0369a1;">EUR (€)</div>
                        <div onclick="setDjuntaCurr('USD')" style="padding:12px; font-size:11px; font-weight:700; color:#0369a1;">USD ($)</div>
                    </div>
                </div>
                <button onclick="handleProfileNavigation(event)" style="background:none; border:none; cursor:pointer;">
                    <i data-lucide="user" style="color:#1d4379; width:22px;"></i>
                </button>
            </div>
        </div>
    `;
}

window.showDrop = (id) => {
    document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
    document.getElementById(id).style.display = 'block';
};

window.setDjuntaLang = (l) => { localStorage.setItem('djunta_lang', l); window.location.reload(); };
window.setDjuntaCurr = (c) => { localStorage.setItem('djunta_curr', c); window.location.reload(); };

function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    const menuHTML = `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:1999; display:none; backdrop-filter:blur(4px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:30px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease;">
        <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
            <img src="logo.png" style="height:25px;">
            <button onclick="toggleMenu()"><i data-lucide="x" style="color:#94a3b8;"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:20px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
            <a href="index.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
            <a href="find-driver.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="user-check"></i> ${DjuntaT('nav_drivers')}</a>
            <a href="search-car.html" style="display:flex; gap:12px; align-items:center;"><i data-lucide="car-front"></i> ${DjuntaT('nav_cars')}</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; padding:15px; border-radius:15px; font-weight:900; text-transform:uppercase; font-size:10px; display:flex; justify-content:center; gap:8px;">
            <i data-lucide="log-out"></i> ${DjuntaT('logout')}
        </button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

function injectFooter() {
    if (document.getElementById('master-footer')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <footer id="master-footer" style="margin:40px auto; padding:20px; text-align:center; border-top:1px solid #f1f5f9;">
        <p style="font-size:9px; color:#cbd5e1; font-weight:800; text-transform:uppercase;">© 2026 DjuntaCar • Cabo Verde</p>
    </footer>`);
}

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
