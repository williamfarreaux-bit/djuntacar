/** PAGE: layout.js | VERSION: 2.0.0 */
/** * DESCRIPTION: Master Layout universel. 
 * Gère l'affichage des icônes distinctes pour Chauffeur (Volant) et Compte (Profil).
 */

console.log("DjuntaCar Layout Master - v2.0.0");

document.addEventListener("DOMContentLoaded", () => {
    window.DjuntaFormat = (val, curr) => {
        const brain = DJUNTA_CONFIG.currencyBrain;
        const rate = brain.rates[curr] || 1;
        return `${Math.round(val * rate)} ${brain.symbols[curr]}`;
    };

    const slot = document.getElementById('header-slot');
    if (slot) {
        injectHeaderContent(slot);
    } else {
        const autoSlot = document.createElement('div');
        autoSlot.id = 'header-slot';
        document.body.prepend(autoSlot);
        injectHeaderContent(autoSlot);
    }
    
    injectMobileMenu(); 
    injectFooter();
    injectPWAPopup(); 
    
    if (window.lucide) window.lucide.createIcons();
});

function injectHeaderContent(el) {
    el.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
    el.innerHTML = `
        <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer; padding:5px;">
                <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
            </button>
            <img src="logo.png" style="height:30px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
            <button onclick="window.location.href='profile.html'" style="background:none; border:none; cursor:pointer; padding:5px;">
                <i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i>
            </button>
        </div>`;
}

function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
    <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <img src="logo.png" style="height:32px;">
            <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
        </div>
        <nav style="display:flex; flex-direction:column; gap:12px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
            <a href="index.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
            <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="steering-wheel"></i> ${DjuntaT('nav_driver')}</a>
            <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
            <a href="my-rentals.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="calendar"></i> ${DjuntaT('nav_rentals')}</a>
            <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="wallet"></i> ${DjuntaT('nav_wallet')}</a>
            <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:10px;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_account')}</a>
        </nav>
        <button onclick="handleLogout()" style="margin-top:auto; background:#fef2f2; color:#ef4444; border:none; padding:15px; border-radius:15px; font-weight:900; font-size:12px; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer;">
            <i data-lucide="log-out"></i> ${DjuntaT('btn_logout')}
        </button>
    </div>`);
}

function injectFooter() {
    if (document.getElementById('master-footer')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <footer id="master-footer" style="padding:40px 20px 180px; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9; margin-top:50px;">
        <div style="display:flex; justify-content:center; gap:25px; margin-bottom:20px;">
            <a href="terms.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_terms')}</a>
            <a href="privacy.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_privacy')}</a>
        </div>
        <p style="font-size:9px; color:#cbd5e1; font-weight:700; letter-spacing:1px;">© 2026 DJUNTACAR • v2.0.0</p>
    </footer>`);
}

function injectPWAPopup() {
    if (document.getElementById('pwa-modal')) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    document.body.insertAdjacentHTML('beforeend', `
    <div id="pwa-modal" style="display:none; position:fixed; inset:0; z-index:10000; background:rgba(29,67,121,0.7); backdrop-filter:blur(8px); align-items:center; justify-content:center; padding:20px;">
        <div style="background:white; width:100%; max-width:340px; border-radius:35px; padding:30px; text-align:center; box-shadow:0 25px 50px rgba(0,0,0,0.3);">
            <div style="width:75px; height:75px; background:white; border-radius:22px; margin:-70px auto 20px auto; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,0.1); border:1px solid #f1f5f9;">
                <img src="sigle.png" style="width:45px; height:45px; object-fit:contain;">
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#1d4379; margin-bottom:8px; text-transform:uppercase;">${DjuntaT('pwa_title')}</h3>
            <p style="font-size:12px; font-weight:600; color:#64748b; line-height:1.5; margin-bottom:25px;">${DjuntaT('pwa_desc')}</p>
            ${isIOS ? `
                <div style="background:#f8fafc; padding:15px; border-radius:20px; border:1px dashed #cbd5e1; margin-bottom:20px;">
                    <p style="font-size:11px; font-weight:800; color:#1d4379;">
                        ${DjuntaT('pwa_ios_guide').replace('[icon]', '<i data-lucide="share" style="display:inline-block; width:16px; vertical-align:middle;"></i>')}
                    </p>
                </div>
            ` : `
                <button id="pwa-btn-install" style="width:100%; background:#1d4379; color:white; border:none; padding:18px; border-radius:20px; font-weight:900; text-transform:uppercase; font-size:12px; margin-bottom:12px; cursor:pointer;">${DjuntaT('pwa_btn_install')}</button>
            `}
            <button onclick="document.getElementById('pwa-modal').style.display='none'" style="background:none; border:none; color:#94a3b8; font-weight:800; font-size:11px; text-transform:uppercase; cursor:pointer;">${DjuntaT('pwa_btn_close')}</button>
        </div>
    </div>`);

    if (window.innerWidth < 1024) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); window.deferredPrompt = e;
            setTimeout(() => { 
                const modal = document.getElementById('pwa-modal');
                if(modal) modal.style.display = 'flex'; 
                if(window.lucide) lucide.createIcons(); 
            }, 3000);
        });
        if (isIOS) setTimeout(() => { 
            const modal = document.getElementById('pwa-modal');
            if(modal) modal.style.display = 'flex'; 
            if(window.lucide) lucide.createIcons(); 
        }, 3000);
    }

    document.getElementById('pwa-btn-install')?.addEventListener('click', async () => {
        const pe = window.deferredPrompt; if (!pe) return;
        pe.prompt(); await pe.outcome;
        document.getElementById('pwa-modal').style.display = 'none';
        window.deferredPrompt = null;
    });
}

window.toggleMenu = () => {
    const m = document.getElementById('mobile-menu'); 
    const o = document.getElementById('menu-overlay');
    if (!m || !o) return;
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
