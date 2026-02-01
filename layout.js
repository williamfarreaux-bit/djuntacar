/** PAGE: layout.js | VERSION: 1.9.2 */
/** DESCRIPTION: Master Layout. Injection [Burger] - [Logo] - [Icons Chat/Profil]. */

(function() {
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
            const response = await fetch('header-config.json');
            const menuData = await response.json();

            slot.style.cssText = "position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9;";
            
            // Structure Flexbox : Left (Burger) | Center (Logo) | Right (Icons)
            let headerHtml = `
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer; padding:5px; width:40px;">
                        <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
                    </button>

                    <img src="logo.png" style="height:28px; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTACAR</b>'">

                    <div style="display:flex; align-items:center; gap:12px; min-width:40px; justify-content:flex-end;">`;

            menuData.nav_items.forEach(item => {
                headerHtml += `
                    <button id="${item.id}" onclick="window.location.href='${item.url}'" style="background:none; border:none; cursor:pointer; padding:5px;">
                        <i data-lucide="${item.icon}" style="color:#1d4379; width:24px;"></i>
                    </button>`;
            });

            headerHtml += `</div></div>`;
            slot.innerHTML = headerHtml;
            
            // Injection du Menu Mobile (Si absent)
            if (!document.getElementById('mobile-menu')) {
                document.body.insertAdjacentHTML('beforeend', `
                <div id="menu-overlay" onclick="window.toggleMenu()" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none; backdrop-filter:blur(2px);"></div>
                <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                        <img src="logo.png" style="height:32px;">
                        <button onclick="window.toggleMenu()" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
                    </div>
                    <nav style="display:flex; flex-direction:column; gap:10px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:11px;">
                        <a href="index.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="home"></i> ${window.DjuntaT ? DjuntaT('nav_home') : 'Accueil'}</a>
                        <a href="search-car.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="car-front"></i> ${window.DjuntaT ? DjuntaT('nav_car') : 'Voitures'}</a>
                        <a href="profile.html" style="padding:12px; display:flex; gap:12px; text-decoration:none; color:inherit;"><i data-lucide="user-circle"></i> ${window.DjuntaT ? DjuntaT('nav_account') : 'Compte'}</a>
                    </nav>
                </div>`);
            }

            if (window.lucide) lucide.createIcons();
            if (window.setupProfileProtection) window.setupProfileProtection();

        } catch (e) { console.error("DjuntaCar Header Render Error", e); }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectHeader);
    else injectHeader();
})();
