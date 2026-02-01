/** PAGE: layout.js | VERSION: 2.0.0 */
/** DESCRIPTION: Master Layout. Header complet, Menu Burger et Footer CGU. */

(function() {
    console.log("Layout v2.0.0 : Init Stable");

    // --- 1. FONCTIONS GLOBALES ---

    // Toggle Menu : Utilisation de classes CSS pour la performance
    window.toggleMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('menu-overlay');
        if (!menu || !overlay) return;
        
        const isOpen = menu.style.transform === 'translateX(0px)';
        
        if (isOpen) {
            menu.style.transform = 'translateX(-100%)';
            overlay.style.display = 'none';
            document.body.style.overflow = ''; // Réactive le scroll
        } else {
            menu.style.transform = 'translateX(0px)';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Bloque le scroll
            if (window.lucide) lucide.createIcons();
        }
    };

    // Formatage Monétaire
    window.DjuntaFormat = function(val, curr) {
        try {
            const b = window.DJUNTA_CONFIG.currencyBrain;
            return Math.round(val * (b.rates[curr] || 1)) + " " + (b.symbols[curr] || curr);
        } catch(e) { return val + " " + curr; }
    };

    // --- 2. INJECTION DOM ---

    const injectUI = function() {
        const headerSlot = document.getElementById('header-slot');
        
        // A. HEADER COMPLET
        if (headerSlot) {
            headerSlot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9; height:70px;";
            headerSlot.innerHTML = `
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer; padding:5px; width:40px;">
                        <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
                    </button>
                    
                    <img src="logo.png" style="height:28px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">
                    
                    <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end; min-width:40px;">
                        <button onclick="window.location.href='chat-list.html'" style="background:none; border:none; cursor:pointer; padding:5px;">
                            <i data-lucide="message-square" style="color:#1d4379; width:24px;"></i>
                        </button>
                        <button id="nav-profile-trigger" onclick="window.location.href='profile.html'" style="background:none; border:none; cursor:pointer; padding:5px;">
                            <i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i>
                        </button>
                    </div>
                </div>`;
        }

        // B. MENU MOBILE & OVERLAY
        if (!document.getElementById('mobile-menu')) {
            document.body.insertAdjacentHTML('beforeend', `
            <div id="menu-overlay" onclick="window.toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
            <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <img src="logo.png" style="height:32px;" onerror="this.style.display='none'">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x" style="color:#1d4379;"></i></button>
                </div>
                <nav style="display:flex; flex-direction:column; gap:10px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                    <a href="index.html" style="text-decoration:none; color:inherit; display:flex; gap:12px; padding:12px; align-items:center;"><i data-lucide="home" style="width:18px"></i> ${DjuntaT('nav_home')}</a>
                    <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; gap:12px; padding:12px; align-items:center;"><i data-lucide="steering-wheel" style="width:18px"></i> ${DjuntaT('nav_driver')}</a>
                    <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; gap:12px; padding:12px; align-items:center;"><i data-lucide="car-front" style="width:18px"></i> ${DjuntaT('nav_car')}</a>
                    <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; gap:12px; padding:12px; align-items:center;"><i data-lucide="wallet" style="width:18px"></i> ${DjuntaT('nav_wallet')}</a>
                    <hr style="border:none; border-top:1px solid #f1f5f9; margin:10px 0;">
                    <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; gap:12px; padding:12px; align-items:center;"><i data-lucide="user-circle" style="width:18px"></i> ${DjuntaT('nav_account')}</a>
                </nav>
            </div>`);
        }

        // C. FOOTER AVEC CGU
        if (!document.getElementById('master-footer')) {
            document.body.insertAdjacentHTML('beforeend', `
            <footer id="master-footer" style="padding:40px 20px 200px; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9; margin-top:50px;">
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom:15px;">
                    <a href="terms.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_terms')}</a>
                    <a href="privacy.html" style="text-decoration:none; font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase;">${DjuntaT('footer_privacy')}</a>
                </div>
                <p style="font-size:9px; color:#cbd5e1; font-weight:700; letter-spacing:1px;">© 2026 DJUNTACAR • v2.0.0</p>
            </footer>`);
        }

        if (window.lucide) lucide.createIcons();
    };

    // Exécution immédiate si le DOM est prêt, sinon on attend
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
})();
