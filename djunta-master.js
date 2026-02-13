// DJUNTA MASTER v2.0 (Avec Logo Image)
console.log("✅ Chargement du Menu avec Logo...");

// 1. CONFIGURATION SUPABASE & OUTILS
const CONFIG = {
    url: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    key: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-"
};

// Outils globaux
window.DJUNTA = {
    sb: null,
    formatMoney: (amount) => {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', 
            currency: 'CVE', 
            maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    }
};

// Connexion Supabase
if(window.supabase) {
    window.DJUNTA.sb = window.supabase.createClient(CONFIG.url, CONFIG.key);
}

// 2. LE COMPOSANT MENU (HEADER)
class DjuntaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <header class="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-100 px-4 flex items-center justify-between font-sans shadow-sm">
            
            <div class="flex items-center gap-4">
                <button onclick="document.getElementById('mobile-menu-overlay').classList.remove('hidden')" class="md:hidden text-[#1d4379] p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
                
                <div class="hidden md:flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
                    <img src="logo.png" alt="DjuntaCar" class="h-8 w-auto object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    
                    <span class="text-[#1d4379] font-black uppercase text-sm tracking-tighter hidden">DjuntaCar</span>
                </div>
            </div>

            <div class="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onclick="window.location.href='index.html'">
                <img src="logo.png" alt="DjuntaCar" class="h-8 w-auto object-contain">
            </div>

            <div class="flex items-center gap-3">
                
                <select id="lang-selector-header" onchange="window.changeLanguage(this.value)" class="bg-gray-100 text-[#1d4379] text-[10px] font-bold py-1.5 px-2 rounded-lg border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors hidden md:block">
                    <option value="pt">PT</option>
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                </select>

                <button onclick="window.location.href='profile.html'" class="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#1d4379] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
            </div>
        </header>

        <div id="mobile-menu-overlay" class="hidden fixed inset-0 z-[100]">
            <div onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            
            <div class="absolute top-0 left-0 bottom-0 w-[85%] max-w-[300px] bg-white p-6 shadow-2xl flex flex-col">
                <div class="flex justify-between items-center mb-8">
                    <img src="logo.png" alt="DjuntaCar" class="h-6 w-auto object-contain">
                    
                    <button onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                    </button>
                </div>
                
                <nav class="flex flex-col gap-6 text-[#1d4379] font-bold text-lg">
                    <a href="index.html" class="flex items-center gap-3">Início</a>
                    <a href="search-car.html" class="flex items-center gap-3">Alugar</a>
                    <a href="driver-application.html" class="flex items-center gap-3">Motorista</a>
                    <a href="profile.html" class="flex items-center gap-3">Perfil</a>
                </nav>

                <div class="mt-auto border-t border-gray-100 pt-6">
                    <p class="text-xs font-bold text-gray-400 mb-3 uppercase">Idioma</p>
                    <div class="flex gap-2">
                        <button onclick="window.changeLanguage('pt')" class="flex-1 py-2 bg-[#1d4379] text-white rounded-lg text-xs font-bold shadow-md">PT</button>
                        <button onclick="window.changeLanguage('fr')" class="flex-1 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">FR</button>
                        <button onclick="window.changeLanguage('en')" class="flex-1 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">EN</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 70px;"></div>
        `;
        
        // Synchroniser le selecteur de langue
        setTimeout(() => {
            const savedLang = localStorage.getItem('djunta_lang') || 'pt';
            const selector = document.getElementById('lang-selector-header');
            if(selector) selector.value = savedLang;
        }, 500);
    }
}

// Enregistrement
if (!customElements.get('djunta-header')) {
    customElements.define('djunta-header', DjuntaHeader);
}
