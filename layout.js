/** PAGE: layout.js | VERSION: 2.0.6 */
/** * DESCRIPTION: Injection robuste du Header et du Menu. 
 * Pas de dépendances de temps, exécution directe.
 */

(function() {
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

    window.toggleMenu = function() {
        const m = document.getElementById('mobile-menu');
        const o = document.getElementById('menu-overlay');
        if (!m || !o) return;
        const isOpen = m.style.transform === 'translateX(0px)';
        m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
        o.style.display = isOpen ? 'none' : 'block';
        if (!isOpen && window.lucide) lucide.createIcons();
    };

    const injectLayout = function() {
        const slot = document.getElementById('header-slot');
        if (slot) {
            slot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
            slot.innerHTML = `
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <button onclick="toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="menu" style="color:#1d4379; width:26px;"></i></button>
                    <img src="logo.png" style="height:30px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b>DJUNTACAR</b>'">
                    <button onclick="window.location.href='profile.html'" style="background:none; border:none; cursor:pointer;"><i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i></button>
                </div>`;
        }

        if (!document.getElementById('mobile-menu')) {
            document.body.insertAdjacentHTML('beforeend', `
            <div id="menu-overlay" onclick="toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
            <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <img src="logo.png" style="height:32px;">
                    <button onclick="toggleMenu()" style="background:none; border:none;"><i data-lucide="x"></i></button>
                </div>
                <nav style="display:flex; flex-direction:column; gap:10px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                    <a href="index.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
                    <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px;"><i data-lucide="steering-wheel"></i> ${DjuntaT('nav_driver')}</a>
                    <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
                    <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px;"><i data-lucide="wallet"></i> ${DjuntaT('nav_wallet')}</a>
                    <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_account')}</a>
                </nav>
            </div>`);
        }
        if (window.lucide) lucide.createIcons();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectLayout);
    } else {
        injectLayout();
    }
})();
