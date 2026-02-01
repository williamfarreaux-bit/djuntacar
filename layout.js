/** PAGE: layout.js | VERSION: 1.9.3 */
/**
 * DESCRIPTION: Master Layout gérant l'injection UI, le menu mobile (icône volant), 
 * le footer traduit et l'invitation d'installation PWA personnalisée.
 */

console.log("DjuntaCar Layout Master - v1.9.3");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Moteur de traduction global
    window.DjuntaT = (key) => {
        const lang = DJUNTA_CONFIG.langBrain.current;
        if (typeof DJUNTA_TRANSLATIONS !== 'undefined' && DJUNTA_TRANSLATIONS[lang]) {
            return DJUNTA_TRANSLATIONS[lang][key] || key;
        }
        return key;
    };

    // 2. Formateur monétaire
    window.DjuntaFormat = (val, curr) => {
        const brain = DJUNTA_CONFIG.currencyBrain;
        const rate = brain.rates[curr] || 1;
        return `${Math.round(val * rate)} ${brain.symbols[curr]}`;
    };

    // 3. Injection des composants
    injectHeaderContent(document.getElementById('header-slot') || document.body.prepend(document.createElement('header')));
    injectMobileMenu(); 
    injectFooter();
    injectPWAInvitation(); // Gestion du raccourci mobile
    
    if (window.lucide) window.lucide.createIcons();
});

/**
 * COMPOSANT : INVITATION INSTALLATION PWA
 */
function injectPWAInvitation() {
    if (document.getElementById('pwa-banner')) return;

    // Structure demandée : bouton blanc avec sigle.png par-dessus
    document.body.insertAdjacentHTML('beforeend', `
    <div id="pwa-banner" style="position:fixed; bottom:20px; left:20px; right:20px; background:white; border-radius:25px; padding:20px; display:none; align-items:center; gap:15px; box-shadow:0 15px 40px rgba(0,0,0,0.15); z-index:9999; border:1px solid #f1f5f9;">
        <div style="width:55px; height:55px; background:white; border-radius:15px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); flex-shrink:0; border:1px solid #f1f5f9;">
            <img src="sigle.png" style="width:35px; height:35px; object-fit:contain;">
        </div>
        <div style="flex-grow:1;">
            <h4 style="margin:0; font-size:12px; font-weight:900; color:#1d4379; text-transform:uppercase;">${DjuntaT('pwa_install_title')}</h4>
            <p style="margin:2px 0 0 0; font-size:10px; font-weight:600; color:#94a3b8; line-height:1.2;">${DjuntaT('pwa_install_text')}</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:5px;">
            <button id="pwa-accept" style="background:#1d4379; color:white; border:none; padding:10px 14px; border-radius:12px; font-size:10px; font-weight:900; cursor:pointer;">${DjuntaT('pwa_install_btn')}</button>
            <button onclick="document.getElementById('pwa-banner').style.display='none'" style="background:none; border:none; color:#cbd5e1; font-size:9px; font-weight:700; cursor:pointer;">${DjuntaT('pwa_install_later')}</button>
        </div>
    </div>`);

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        setTimeout(() => { 
            const banner = document.getElementById('pwa-banner');
            if(banner) banner.style.display = 'flex'; 
        }, 2500);
    });

    document.getElementById('pwa-accept')?.addEventListener('click', async () => {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) return;
        promptEvent.prompt();
        await promptEvent.outcome;
        document.getElementById('pwa-banner').style.display = 'none';
        window.deferredPrompt = null;
    });
}

function injectHeaderContent(targetElement) {
    targetElement.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
    targetElement.innerHTML = `
        <div style="height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 600px; margin: 0 auto;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="menu" style="color:#1d4379; width:26px;"></i></button>
            <img src="logo.png" style="height: 30px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
            <button onclick="window.location.href='profile.html'" style="background:none; border:none; cursor:pointer;"><i data-lucide="user" style="color:#1d4379; width:24px;"></i></button>
        </div>`;
}

function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:all 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
            <a href="index.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
            <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="steering-wheel"></i> ${DjuntaT('nav_driver')}</a>
            <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
            <a href="my-rentals.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="calendar"></i> ${DjuntaT('nav_rentals')}</a>
            <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="wallet"></i> ${DjuntaT('nav_wallet')}</a>
            <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:8px;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_account')}</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:15px; font-weight:900; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;">
            <i data-lucide="log-out"></i> ${DjuntaT('btn_logout')}
        </button>
    </div>`);
}

function injectFooter() {
    if (document.getElementById('master-footer')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <footer id="master-footer" style="padding:40px 20px 200px 20px; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9;">
        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
            <a href="terms.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_terms')}</a>
            <a href="privacy.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_privacy')}</a>
        </div>
        <p style="font-size:9px; color:#cbd5e1; font-weight:700;">© 2026 DJUNTACAR • v1.9.3</p>
    </footer>`);
}

window.toggleMenu = () => {
    const m = document.getElementById('mobile-menu');
    const o = document.getElementById('menu-overlay');
    if(!m || !o) return;
    const isOpen = m.style.transform === 'translateX(0px)';
    m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
    o.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && window.lucide) lucide.createIcons();
};

window.handleLogout = async () => { 
    const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey); 
    await sb.auth.signOut(); 
    window.location.href = 'login.html'; 
};
