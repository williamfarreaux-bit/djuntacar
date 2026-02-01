/** PAGE: layout.js | VERSION: 2.1.1 */
/** DESCRIPTION: Master Layout Universel. Injection Header, Menu (CSS class toggle), Footer et PWA. */

(function() {
    console.log("DjuntaCar Layout Master - v2.1.1");

    // 1. CSS Critique injecté pour le menu
    const style = document.createElement('style');
    style.innerHTML = `
        #mobile-menu {
            position: fixed; top: 0; left: 0; bottom: 0; width: 280px; 
            background: white; z-index: 2000; padding: 24px; 
            display: flex; flex-direction: column; 
            transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 10px 0 30px rgba(0,0,0,0.1);
        }
        #mobile-menu.active { transform: translateX(0) !important; }
        #menu-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5); 
            z-index: 1999; display: none; backdrop-filter: blur(2px);
        }
        #menu-overlay.active { display: block !important; }
    `;
    document.head.appendChild(style);

    // 2. Fonctions globales
    window.DjuntaFormat = function(val, curr) {
        try {
            const b = window.DJUNTA_CONFIG.currencyBrain;
            return Math.round(val * (b.rates[curr] || 1)) + " " + (b.symbols[curr] || curr);
        } catch(e) { return val + " " + curr; }
    };

    window.toggleMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('menu-overlay');
        if (!menu || !overlay) return;

        menu.classList.toggle('active');
        overlay.classList.toggle('active');

        if (menu.classList.contains('active') && window.lucide) {
            lucide.createIcons();
        }
    };

    const injectUI = function() {
        // Header
        const slot = document.getElementById('header-slot');
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

        // Menu & Overlay
        if (!document.getElementById('mobile-menu')) {
            document.body.insertAdjacentHTML('beforeend', `
            <div id="menu-overlay" onclick="window.toggleMenu()"></div>
            <div id="mobile-menu">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <img src="logo.png" style="height:32px;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
                </div>
                <nav style="display:flex; flex-direction:column; gap:10px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                    <a href="index.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
                    <a href="search-driver.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="steering-wheel"></i> ${DjuntaT('nav_driver')}</a>
                    <a href="search-car.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
                    <a href="my-rentals.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="calendar"></i> ${DjuntaT('nav_rentals')}</a>
                    <a href="wallet.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="wallet"></i> ${DjuntaT('nav_wallet')}</a>
                    <hr style="border:none; border-top:1px solid #f1f5f9; margin:10px 0;">
                    <a href="profile.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_account')}</a>
                </nav>
            </div>`);
        }

        // Footer
        if (!document.getElementById('master-footer')) {
            document.body.insertAdjacentHTML('beforeend', `
            <footer id="master-footer" style="padding:40px 20px 200px; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9; margin-top:50px;">
                <p style="font-size:9px; color:#cbd5e1; font-weight:700;">© 2026 DJUNTACAR • v2.1.1</p>
            </footer>`);
        }

        if (window.lucide) lucide.createIcons();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
    else injectUI();
})();
