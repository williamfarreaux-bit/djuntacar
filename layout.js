/** PAGE: layout.js | VERSION: 2.0.8 */
/** * DESCRIPTION: Master Layout. Correctif critique du menu burger.
 * Injection robuste du Header, Menu Mobile et Footer.
 */

(function() {
    console.log("DjuntaCar Layout Master - v2.0.8");

    // Formateur monétaire global
    window.DjuntaFormat = function(val, curr) {
        try {
            const b = window.DJUNTA_CONFIG.currencyBrain;
            const rate = b.rates[curr] || 1;
            const symbol = b.symbols[curr] || curr;
            return Math.round(val * rate) + " " + symbol;
        } catch(e) { 
            return val + " " + curr; 
        }
    };

    // Fonction Toggle Menu corrigée
    window.toggleMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('menu-overlay');
        if (!menu || !overlay) return;

        // Détection de l'état actuel
        const isOpen = menu.classList.contains('menu-open');

        if (isOpen) {
            menu.style.transform = 'translateX(-100%)';
            overlay.style.display = 'none';
            menu.classList.remove('menu-open');
        } else {
            menu.style.transform = 'translateX(0px)';
            overlay.style.display = 'block';
            menu.classList.add('menu-open');
            // Rafraîchissement des icônes à l'ouverture
            if (window.lucide) lucide.createIcons();
        }
    };

    const injectUI = function() {
        const slot = document.getElementById('header-slot');
        
        // 1. Injection Header
        if (slot) {
            slot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
            slot.innerHTML = `
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer; padding:5px;">
                        <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
                    </button>
                    <img src="logo.png" style="height:30px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
                    <button onclick="window.location.href='profile.html'" style="background:none; border:none; cursor:pointer; padding:5px;">
                        <i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i>
                    </button>
                </div>`;
        }

        // 2. Injection Menu Mobile & Overlay
        if (!document.getElementById('mobile-menu')) {
            document.body.insertAdjacentHTML('beforeend', `
            <div id="menu-overlay" onclick="window.toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
            <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease-out; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <img src="logo.png" style="height:32px;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
                </div>
                <nav style="display:flex; flex-direction:column; gap:8px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                    <a href="index.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="home" style="width:18px;"></i> ${DjuntaT('nav_home')}</a>
                    <a href="search-driver.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="steering-wheel" style="width:18px;"></i> ${DjuntaT('nav_driver')}</a>
                    <a href="search-car.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="car-front" style="width:18px;"></i> ${DjuntaT('nav_car')}</a>
                    <a href="my-rentals.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="calendar" style="width:18px;"></i> ${DjuntaT('nav_rentals')}</a>
                    <a href="wallet.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="wallet" style="width:18px;"></i> ${DjuntaT('nav_wallet')}</a>
                    <hr style="border:none; border-top:1px solid #f1f5f9; margin:10px 0;">
                    <a href="profile.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit; border-radius:10px;"><i data-lucide="user-circle" style="width:18px;"></i> ${DjuntaT('nav_account')}</a>
                </nav>
            </div>`);
        }
        
        // 3. Injection Footer
        if (!document.getElementById('master-footer')) {
            document.body.insertAdjacentHTML('beforeend', `
            <footer id="master-footer" style="padding:40px 20px 200px; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9; margin-top:50px;">
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom:15px;">
                    <a href="terms.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_terms')}</a>
                    <a href="privacy.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_privacy')}</a>
                </div>
                <p style="font-size:9px; color:#cbd5e1; font-weight:700;">© 2026 DJUNTACAR • v2.0.8</p>
            </footer>`);
        }

        if (window.lucide) lucide.createIcons();
    };

    // Cycle d'exécution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
})();
