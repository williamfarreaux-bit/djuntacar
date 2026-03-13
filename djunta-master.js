// DJUNTA MASTER v2.1 (Debug Mode)
console.log("♻️ Chargement Menu + Logo...");

const CONFIG = {
    url: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    key: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-"
};

window.DJUNTA = {
    sb: null,
    formatMoney: (amount) => {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    }
};

if(window.supabase) {
    window.DJUNTA.sb = window.supabase.createClient(CONFIG.url, CONFIG.key);
}

class DjuntaHeader extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        var isConnected = localStorage.getItem('djunta_auth') === 'true';
        var lang = localStorage.getItem('djunta_lang') || 'PT';
        var profileHref = isConnected ? 'profile.html' : 'login.html';

        this.innerHTML = `
        <header class="djunta-global-header">
            <div class="dgh-left">
                <button class="dgh-burger" aria-label="Menu" onclick="window.__djuntaToggleMenu()">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="dgh-center" onclick="window.location.href='index.html'">
                <img src="sigle.png" alt="" class="dgh-sigle" onerror="this.style.display='none'">
                <img src="logo.png" alt="DjuntaCar" class="dgh-logo" onerror="this.style.display='none'">
            </div>
            <div class="dgh-right">
                <div class="dgh-lang-pill" onclick="window.__djuntaToggleLang(event)">
                    <span class="dgh-lang-label">${lang}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="4"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="dgh-lang-dropdown" id="dgh-lang-dropdown">
                    <div class="dgh-lang-opt" onclick="window.__djuntaSetLang('PT')">Português</div>
                    <div class="dgh-lang-opt" onclick="window.__djuntaSetLang('FR')">Français</div>
                    <div class="dgh-lang-opt" onclick="window.__djuntaSetLang('EN')">English</div>
                </div>
                <div class="dgh-profile${isConnected ? ' is-connected' : ''}" onclick="window.location.href='${profileHref}'">
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
            </div>
        </header>

        <div id="dgh-mobile-menu" class="dgh-mobile-menu">
            <div class="dgh-menu-header">
                <img src="logo.png" alt="DjuntaCar" style="height:25px" onerror="this.style.display='none'">
                <button onclick="window.__djuntaToggleMenu()" class="dgh-menu-close">&times;</button>
            </div>
            <nav class="dgh-menu-nav">
                <a href="index.html">Início</a>
                <a href="search-car.html">Alugar</a>
                <a href="search-driver.html">Motorista</a>
                <a href="profile.html">Perfil</a>
            </nav>
        </div>
        <div class="dgh-spacer"></div>
        `;
    }
}

// --- Global interaction helpers for the standardized header ---
if (!window.__djuntaToggleMenu) {
    window.__djuntaToggleMenu = function () {
        var m = document.getElementById('dgh-mobile-menu');
        if (m) m.classList.toggle('active');
    };
}
if (!window.__djuntaToggleLang) {
    window.__djuntaToggleLang = function (e) {
        e.stopPropagation();
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.toggle('active');
    };
}
if (!window.__djuntaSetLang) {
    window.__djuntaSetLang = function (lang) {
        localStorage.setItem('djunta_lang', lang);
        var label = document.querySelector('.dgh-lang-label');
        if (label) label.textContent = lang;
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.remove('active');
        if (typeof window.changeLanguage === 'function') window.changeLanguage(lang);
    };
    document.addEventListener('click', function () {
        var dd = document.getElementById('dgh-lang-dropdown');
        if (dd) dd.classList.remove('active');
    });
}
if (!customElements.get('djunta-header')) customElements.define('djunta-header', DjuntaHeader);
