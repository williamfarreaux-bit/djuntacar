// DJUNTA MASTER v2.2 - Standardized Header & Language Persistence
console.log("♻️ Chargement Menu + Logo...");

const CONFIG = {
    url: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    key: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-"
};

// Translation dictionary (from index.html)
const TRANSLATIONS = {
    fr: {
        nav_home: "Accueil", nav_rent: "Louer", nav_driver: "Chauffeur", menu_profile: "Profil"
    },
    pt: {
        nav_home: "Início", nav_rent: "Alugar", nav_driver: "Motorista", menu_profile: "Perfil"
    },
    en: {
        nav_home: "Home", nav_rent: "Rent", nav_driver: "Driver", menu_profile: "Profile"
    }
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

// Global function to toggle menu
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('hidden');
};

// Global function to change language with localStorage persistence
window.changeLanguage = function(lang) {
    localStorage.setItem('djunta_lang', lang);
    const dict = TRANSLATIONS[lang];
    if(!dict) return;
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(dict[key]) el.innerHTML = dict[key];
    });

    const sel = document.getElementById('lang-selector');
    if(sel) sel.value = lang;
};

class DjuntaHeader extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.innerHTML = `
        <style>
            .djunta-header {
                position: fixed; top: 0; left: 0; right: 0; height: 75px;
                background: white; z-index: 50; border-bottom: 1px solid #f1f5f9;
                display: flex; align-items: center; justify-content: space-between;
                padding: 0 20px; box-shadow: 0 2px 15px rgba(0,0,0,0.03);
            }
            .djunta-header-spacer { height: 75px; }
        </style>

        <header class="djunta-header">
            <div class="flex items-center z-10">
                <button onclick="toggleMenu()" class="text-[#1d4379] p-1">
                    <i data-lucide="menu" class="w-8 h-8"></i>
                </button>
            </div>

            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer" onclick="window.location.href='index.html'">
                <img src="./logo.png" alt="DjuntaCar" class="h-10 w-auto object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <span class="hidden font-black text-[#1d4379] italic text-2xl tracking-tighter">DjuntaCar</span>
            </div>

            <div class="flex items-center gap-2 z-10">
                <select id="lang-selector" onchange="changeLanguage(this.value)" class="bg-gray-50 text-[#1d4379] text-[10px] font-bold py-2 px-2 rounded-lg border-none outline-none cursor-pointer">
                    <option value="fr">FR</option>
                    <option value="pt">PT</option>
                    <option value="en">EN</option>
                </select>
                <button onclick="window.location.href='profile.html'" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-blue-50 hover:text-[#1d4379] transition-colors">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </button>
            </div>
        </header>

        <div id="mobile-menu" class="hidden fixed inset-0 z-[100]">
            <div onclick="toggleMenu()" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div class="absolute top-0 left-0 bottom-0 w-[85%] bg-white p-6 shadow-2xl flex flex-col transition-transform">
                <div class="flex justify-between items-center mb-10">
                    <span class="font-black text-[#1d4379] text-xl">Menu</span>
                    <button onclick="toggleMenu()" class="p-2 bg-gray-50 rounded-full"><i data-lucide="x" class="w-6 h-6 text-gray-500"></i></button>
                </div>
                <nav class="flex flex-col gap-4 text-lg font-bold text-[#1d4379]">
                    <a href="index.html" class="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl"><i data-lucide="home" class="w-5 h-5"></i> <span data-key="nav_home">Accueil</span></a>
                    <a href="search-car.html" class="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl"><i data-lucide="search" class="w-5 h-5"></i> <span data-key="nav_rent">Louer</span></a>
                    <a href="driver-application.html" class="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl"><i data-lucide="briefcase" class="w-5 h-5"></i> <span data-key="nav_driver">Chauffeur</span></a>
                    <a href="profile.html" class="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl"><i data-lucide="user" class="w-5 h-5"></i> <span data-key="menu_profile">Profil</span></a>
                </nav>
            </div>
        </div>

        <div class="djunta-header-spacer"></div>
        `;

        // Apply saved language on header load
        setTimeout(() => {
            const savedLang = localStorage.getItem('djunta_lang') || 'fr';
            const sel = document.getElementById('lang-selector');
            if(sel) sel.value = savedLang;
            changeLanguage(savedLang);
            if(window.lucide) lucide.createIcons();
        }, 50);
    }
}
if (!customElements.get('djunta-header')) customElements.define('djunta-header', DjuntaHeader);
