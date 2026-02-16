// LAYOUT.JS - Global Header Generator (DjuntaCar)
// Injects a standardized header on all pages via generateHeader()

(function () {
    'use strict';

    /**
     * Generate and inject the global header into the page.
     * If a #header-slot element exists, the header is placed inside it.
     * Otherwise, it is prepended to document.body.
     */
    function generateHeader() {
        // Determine if the user is connected
        var isConnected = localStorage.getItem('djunta_auth') === 'true';

        // Current language
        var lang = localStorage.getItem('djunta_lang') || 'PT';

        // Profile destination based on auth state
        var profileHref = isConnected ? 'profile.html' : 'login.html';

        // Build header element
        var header = document.createElement('header');
        header.className = 'djunta-global-header';
        header.innerHTML =
            '<div class="dgh-left">' +
                '<button class="dgh-burger" aria-label="Menu" onclick="window.__djuntaToggleMenu()">' +
                    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<line x1="4" x2="20" y1="6" y2="6"></line>' +
                        '<line x1="4" x2="20" y1="12" y2="12"></line>' +
                        '<line x1="4" x2="20" y1="18" y2="18"></line>' +
                    '</svg>' +
                '</button>' +
            '</div>' +
            '<div class="dgh-center" onclick="window.location.href=\'index.html\'">' +
                '<img src="sigle.png" alt="" class="dgh-sigle" onerror="this.style.display=\'none\'">' +
                '<img src="logo.png" alt="DjuntaCar" class="dgh-logo" onerror="this.style.display=\'none\'">' +
            '</div>' +
            '<div class="dgh-right">' +
                '<div class="dgh-lang-pill" onclick="window.__djuntaToggleLang(event)">' +
                    '<span class="dgh-lang-label">' + lang + '</span>' +
                    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="4"><path d="M6 9l6 6 6-6"/></svg>' +
                '</div>' +
                '<div class="dgh-lang-dropdown" id="dgh-lang-dropdown">' +
                    '<div class="dgh-lang-opt" onclick="window.__djuntaSetLang(\'PT\')">Português</div>' +
                    '<div class="dgh-lang-opt" onclick="window.__djuntaSetLang(\'FR\')">Français</div>' +
                    '<div class="dgh-lang-opt" onclick="window.__djuntaSetLang(\'EN\')">English</div>' +
                '</div>' +
                '<div class="dgh-profile' + (isConnected ? ' is-connected' : '') + '" onclick="window.location.href=\'' + profileHref + '\'">' +
                    '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' +
                '</div>' +
            '</div>';

        // Build mobile menu overlay
        var menu = document.createElement('div');
        menu.id = 'dgh-mobile-menu';
        menu.className = 'dgh-mobile-menu';
        menu.innerHTML =
            '<div class="dgh-menu-header">' +
                '<img src="logo.png" alt="DjuntaCar" style="height:25px" onerror="this.style.display=\'none\'">' +
                '<button onclick="window.__djuntaToggleMenu()" class="dgh-menu-close">&times;</button>' +
            '</div>' +
            '<nav class="dgh-menu-nav">' +
                '<a href="index.html">Início</a>' +
                '<a href="search-car.html">Alugar</a>' +
                '<a href="search-driver.html">Motorista</a>' +
                '<a href="profile.html">Perfil</a>' +
            '</nav>';

        // Spacer to push page content below fixed header
        var spacer = document.createElement('div');
        spacer.className = 'dgh-spacer';

        // Insert into the page
        var slot = document.getElementById('header-slot');
        if (slot) {
            slot.appendChild(header);
            slot.appendChild(menu);
            slot.appendChild(spacer);
        } else {
            document.body.insertBefore(spacer, document.body.firstChild);
            document.body.insertBefore(menu, document.body.firstChild);
            document.body.insertBefore(header, document.body.firstChild);
        }
    }

    // --- Global interaction helpers (prefixed to avoid collisions) ---

    window.__djuntaToggleMenu = function () {
        var m = document.getElementById('dgh-mobile-menu');
        if (m) m.classList.toggle('active');
    };

    window.__djuntaToggleLang = function (e) {
        e.stopPropagation();
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.toggle('active');
    };

    window.__djuntaSetLang = function (lang) {
        localStorage.setItem('djunta_lang', lang);
        // Update label in header
        var label = document.querySelector('.dgh-lang-label');
        if (label) label.textContent = lang;
        // Close dropdown
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.remove('active');
        // Trigger i18n update if available
        if (typeof window.changeLanguage === 'function') {
            window.changeLanguage(lang);
        }
        // Update data-i18n elements if a dictionary exists on the page
        if (typeof window.updateLang === 'function') {
            window.updateLang(lang);
        }
    };

    // Close language dropdown when clicking outside
    document.addEventListener('click', function () {
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.remove('active');
    });

    // --- Run on DOM ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateHeader);
    } else {
        generateHeader();
    }

    // Expose for external use
    window.generateHeader = generateHeader;
})();
