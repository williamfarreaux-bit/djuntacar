/** PAGE: layout.js | VERSION: 1.9.1 */
/** DESCRIPTION: Master Layout. Gère l'injection du Header JSON et le Menu Burger. */

(function() {
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
        const isOpen = menu.style.transform === 'translateX(0px)';
        menu.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
        overlay.style.display = isOpen ? 'none' : 'block';
        if (!isOpen && window.lucide) lucide.createIcons();
    };

    async function injectHeader() {
        const slot = document.getElementById('header-slot');
        if (!slot) return;

        try {
            // Respect de votre exigence : Injection via JSON
            const response = await fetch('header-config.json');
            const menuData = await response.json();

            slot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
            let navHtml = `
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer; padding:10px;">
                        <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
                    </button>
                    <img src="logo.png" style="height:30px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b>DJUNTACAR</b>'">
                    <div style="display:flex; gap:10px;">`;

            menuData.nav_items.forEach(item => {
                if(item.id === 'nav-profile-trigger') {
                    navHtml += `<button id="${item.id}" style="background:none; border:none; cursor:pointer;"><i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i></button>`;
                }
            });

            navHtml += `</div></div>`;
            slot.innerHTML = navHtml;
            
            // Injection du Menu Mobile (Overlay)
            if (!document.getElementById('mobile-menu')) {
                document.body.insertAdjacentHTML('beforeend', `
                <div id="menu-overlay" onclick="window.toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
                <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                    <nav style="display:flex; flex-direction:column; gap:10px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                        <a href="index.html" style="padding:12px; display:flex; gap:12px;"><i data-lucide="home"></i> ${DjuntaT('nav_home')}</a>
                        <a href="search-car.html" style="padding:12px; display:flex; gap:12px;"><i data-lucide="car-front"></i> ${DjuntaT('nav_car')}</a>
                        <a href="profile.html" style="padding:12px; display:flex; gap:12px;"><i data-lucide="user-circle"></i> ${DjuntaT('nav_account')}</a>
                    </nav>
                </div>`);
            }
            if (window.lucide) lucide.createIcons();
            if (window.setupProfileProtection) window.setupProfileProtection();

        } catch (e) { console.error("Header Error", e); }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectHeader);
    else injectHeader();
})();
