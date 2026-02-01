/** PAGE: layout.js | VERSION: 3.1.0 */
/** DESCRIPTION: Layout dynamique avec Sélecteur de Langue intégré. */

(function() {
    // Fonctions UI
    window.toggleMenu = function() {
        const m = document.getElementById('mobile-menu');
        const o = document.getElementById('menu-overlay');
        if (m && o) {
            const isClosed = m.style.transform === 'translateX(-100%)' || m.style.transform === '';
            m.style.transform = isClosed ? 'translateX(0px)' : 'translateX(-100%)';
            o.style.display = isClosed ? 'block' : 'none';
            if(isClosed && window.lucide) lucide.createIcons();
        }
    };

    window.checkAuth = async function() {
        if (!window.supabase) return;
        const sb = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);
        const { data } = await sb.auth.getSession();
        window.location.href = data.session ? 'profile.html' : 'login.html';
    };

    // Injection du contenu
    const injectUI = function() {
        const slot = document.getElementById('header-slot');
        if (!slot) return;
        
        // Raccourci de traduction
        const t = window.DjuntaT;

        // Header
        slot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9; height:70px;";
        slot.innerHTML = `
            <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                <button onclick="window.toggleMenu()" style="border:none; background:none; padding:5px;"><i data-lucide="menu" style="color:#1d4379; width:26px;"></i></button>
                <img src="logo.png" style="height:28px;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
                <div style="display:flex; gap:8px;">
                    <button onclick="window.location.href='chat-list.html'" style="border:none; background:none;"><i data-lucide="message-square" style="color:#1d4379; width:24px;"></i></button>
                    <button onclick="window.checkAuth()" style="border:none; background:none;"><i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i></button>
                </div>
            </div>`;

        // Menu Mobile avec SÉLECTEUR DE LANGUE
        if (!document.getElementById('mobile-menu')) {
            // Détection de la langue active pour le style des boutons
            const lang = window.currentLang;
            const btnStyle = "padding:5px 10px; border:1px solid #1d4379; border-radius:5px; background:white; color:#1d4379; font-size:10px; font-weight:bold; cursor:pointer;";
            const activeStyle = "padding:5px 10px; border:1px solid #1d4379; border-radius:5px; background:#1d4379; color:white; font-size:10px; font-weight:bold; cursor:pointer;";

            document.body.insertAdjacentHTML('beforeend', `
            <div id="menu-overlay" onclick="window.toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none;"></div>
            <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                
                <div style="display:flex; justify-content:space-between; margin-bottom:30px;">
                    <span style="font-weight:900; color:#1d4379;">MENU</span>
                    <button onclick="window.toggleMenu()" style="border:none; background:none;"><i data-lucide="x"></i></button>
                </div>

                <div style="display:flex; gap:5px; margin-bottom:20px; justify-content:center; background:#f8fafc; padding:10px; border-radius:10px;">
                    <button onclick="setLanguage('pt')" style="${lang === 'pt' ? activeStyle : btnStyle}">PT</button>
                    <button onclick="setLanguage('fr')" style="${lang === 'fr' ? activeStyle : btnStyle}">FR</button>
                    <button onclick="setLanguage('en')" style="${lang === 'en' ? activeStyle : btnStyle}">EN</button>
                </div>

                <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:12px;">
                    <a href="index.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="home" style="width:18px"></i> ${t('nav_home')}</a>
                    <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="steering-wheel" style="width:18px"></i> ${t('nav_driver')}</a>
                    <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="car-front" style="width:18px"></i> ${t('nav_car')}</a>
                    <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="wallet" style="width:18px"></i> ${t('nav_wallet')}</a>
                    <hr style="border-top:1px solid #f1f5f9;">
                    <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="user-circle" style="width:18px"></i> ${t('nav_account')}</a>
                </nav>
            </div>`);
        }

        // Footer Traduit
        if (!document.getElementById('master-footer')) {
            document.body.insertAdjacentHTML('beforeend', `
            <footer id="master-footer" style="padding:40px 20px 120px; text-align:center; background:#f8fafc; margin-top:40px; border-top:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:center; gap:15px; margin-bottom:10px;">
                    <a href="terms.html" style="font-size:10px; font-weight:800; color:#94a3b8; text-decoration:none;">${t('footer_terms')}</a>
                    <a href="privacy.html" style="font-size:10px; font-weight:800; color:#94a3b8; text-decoration:none;">${t('footer_privacy')}</a>
                </div>
                <p style="font-size:9px; color:#cbd5e1; font-weight:700;">© 2026 DJUNTACAR</p>
            </footer>`);
        }

        if (window.lucide) lucide.createIcons();
    };

    if (document.body) injectUI();
    else document.addEventListener('DOMContentLoaded', injectUI);
})();
