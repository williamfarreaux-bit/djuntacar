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
        const savedLang = localStorage.getItem('djunta_lang') || localStorage.getItem('djuntacar_lang') || 'PT';
        const langLabel = savedLang.toUpperCase();
        const isConnected = localStorage.getItem('djunta_auth') === 'true';
        const profileBg = isConnected ? '#22c55e' : '#1d4379';
        const profileShadow = isConnected ? '0 2px 8px rgba(34, 197, 94, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)';

        this.innerHTML = `
        <style>
            .djunta-header { position: fixed; top: 0; left: 0; right: 0; height: 75px; background: white; z-index: 1000; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
            .djunta-header .header-left { flex: 1; display: flex; align-items: center; }
            .djunta-header .burger-btn { color: #1d4379; font-size: 32px; cursor: pointer; background: none; border: none; padding: 0; }
            .djunta-header .logo-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; cursor: pointer; z-index: 10; }
            .djunta-header .header-right { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 10px; position: relative; }
            .djunta-header .lang-pill { background: #f1f5f9; border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
            .djunta-header .lang-pill span { color: #1d4379; font-size: 12px; font-weight: 900; }
            .djunta-header .lang-dropdown { position: absolute; top: 60px; right: 55px; background: white; border-radius: 15px; border: 1px solid #f1f5f9; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: none; flex-direction: column; overflow: hidden; z-index: 2000; }
            .djunta-header .lang-dropdown.active { display: flex; }
            .djunta-header .lang-opt { padding: 12px 20px; font-size: 11px; font-weight: 800; color: #1d4379; cursor: pointer; text-transform: uppercase; }
            .djunta-header .lang-opt:hover { background: #f8fafc; }
            .djunta-header .profile-circle { width: 42px; height: 42px; border-radius: 50%; background: ${profileBg}; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: ${profileShadow}; cursor: pointer; }
            .djunta-header .profile-circle svg { width: 20px; height: 20px; fill: white; }
        </style>
        <header class="djunta-header">
            <div class="header-left">
                <button onclick="document.getElementById('mobile-menu-overlay').classList.remove('hidden')" class="burger-btn">☰</button>
            </div>
            <div class="logo-center" onclick="window.location.href='index.html'">
                <img src="./logo.png" alt="DjuntaCar" style="height: 40px; width: auto; object-fit: contain;" onerror="this.style.display='none'">
            </div>
            <div class="header-right">
                <div class="lang-pill" id="djunta-lang-pill">
                    <span id="djunta-current-lang">${langLabel}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1d4379" stroke-width="4"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="lang-dropdown" id="djunta-lang-dropdown">
                    <div class="lang-opt" data-lang="PT">Português</div>
                    <div class="lang-opt" data-lang="FR">Français</div>
                    <div class="lang-opt" data-lang="EN">English</div>
                </div>
                <div onclick="window.location.href='profile.html'" class="profile-circle">
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
            </div>
        </header>

        <div id="mobile-menu-overlay" class="hidden fixed inset-0 z-[100]">
            <div onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div class="absolute top-0 left-0 bottom-0 w-[80%] bg-white p-6 shadow-2xl flex flex-col">
                <div class="flex justify-between items-center mb-8">
                    <img src="./logo.png" style="height: 25px;">
                    <button onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
                <nav class="flex flex-col gap-6 text-[#1d4379] font-bold text-lg">
                    <a href="index.html" class="flex items-center gap-3">Início</a>
                    <a href="search-car.html" class="flex items-center gap-3">Alugar</a>
                    <a href="driver-application.html" class="flex items-center gap-3">Motorista</a>
                    <a href="profile.html" class="flex items-center gap-3">Meu Perfil</a>
                </nav>
            </div>
        </div>
        <div style="height: 75px;"></div>
        `;

        // Language pill click handler
        const pill = this.querySelector('#djunta-lang-pill');
        const dropdown = this.querySelector('#djunta-lang-dropdown');
        if (pill && dropdown) {
            pill.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
            dropdown.querySelectorAll('.lang-opt').forEach(function(opt) {
                opt.addEventListener('click', function() {
                    const lang = this.getAttribute('data-lang');
                    localStorage.setItem('djunta_lang', lang);
                    localStorage.setItem('djuntacar_lang', lang.toLowerCase());
                    const label = document.getElementById('djunta-current-lang');
                    if (label) label.innerText = lang;
                    dropdown.classList.remove('active');
                    if (typeof I18n !== 'undefined' && I18n.setLanguage) I18n.setLanguage(lang.toLowerCase());
                });
            });
            document.addEventListener('click', function() { dropdown.classList.remove('active'); });
        }
    }
}
if (!customElements.get('djunta-header')) customElements.define('djunta-header', DjuntaHeader);
