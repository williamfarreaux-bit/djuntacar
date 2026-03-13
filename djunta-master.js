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
    },
    
    // Fonction globale pour changer la langue
    changeLanguage: (lang) => {
        localStorage.setItem('djunta_lang', lang.toLowerCase());
        console.log(`DjuntaCar: Langue changée vers [${lang}]`);
        location.reload(); // Recharger pour appliquer les traductions
    },
    
    // Vérifier l'état de connexion
    isConnected: () => {
        return localStorage.getItem('djunta_auth') === 'true';
    }
};

if(window.supabase) {
    window.DJUNTA.sb = window.supabase.createClient(CONFIG.url, CONFIG.key);
}

class DjuntaHeader extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        // Récupérer la langue actuelle
        const currentLang = (localStorage.getItem('djunta_lang') || 'pt').toUpperCase();
        const isConnected = localStorage.getItem('djunta_auth') === 'true';
        
        this.innerHTML = `
        <header class="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-100 px-4 flex items-center justify-between font-sans shadow-sm">
            
            <div class="flex items-center gap-4">
                <button onclick="document.getElementById('mobile-menu-overlay').classList.remove('hidden')" class="md:hidden text-[#1d4379]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
                
                <div class="hidden md:flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
                    <img src="./logo.png" alt="DjuntaCar" style="height: 35px; width: auto; object-fit: contain;"> 
                </div>
            </div>

            <div class="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onclick="window.location.href='index.html'">
                <img src="./logo.png" alt="DjuntaCar" style="height: 30px; width: auto; object-fit: contain;">
            </div>

            <div class="flex items-center gap-3">
                <select onchange="window.DJUNTA.changeLanguage(this.value)" class="bg-gray-100 text-[#1d4379] text-[10px] font-bold py-1 px-2 rounded-lg hidden md:block">
                    <option value="pt" ${currentLang === 'PT' ? 'selected' : ''}>PT</option>
                    <option value="fr" ${currentLang === 'FR' ? 'selected' : ''}>FR</option>
                    <option value="en" ${currentLang === 'EN' ? 'selected' : ''}>EN</option>
                </select>
                <button onclick="window.location.href='profile.html'" 
                    class="w-9 h-9 ${isConnected ? 'bg-green-500' : 'bg-blue-900'} rounded-full flex items-center justify-center border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
            </div>
        </header>

        <div id="mobile-menu-overlay" class="hidden fixed inset-0 z-[100]">
            <div onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div class="absolute top-0 left-0 bottom-0 w-[80%] bg-white p-6 shadow-2xl flex flex-col">
                <div class="flex justify-between items-center mb-8">
                    <img src="./logo.png" style="height: 25px;">
                    <button onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg></button>
                </div>
                <nav class="flex flex-col gap-6 text-[#1d4379] font-bold text-lg">
                    <a href="index.html" class="flex items-center gap-3" data-i18n="nav_home">Início</a>
                    <a href="search-car.html" class="flex items-center gap-3" data-i18n="nav_rent">Alugar</a>
                    <a href="driver-application.html" class="flex items-center gap-3" data-i18n="nav_driver">Motorista</a>
                </nav>
                <div class="mt-8">
                    <label class="text-[#1d4379] text-xs font-bold block mb-2">Idioma / Language</label>
                    <select onchange="window.DJUNTA.changeLanguage(this.value)" class="w-full bg-gray-100 text-[#1d4379] text-sm font-bold py-3 px-3 rounded-lg">
                        <option value="pt" ${currentLang === 'PT' ? 'selected' : ''}>Português</option>
                        <option value="fr" ${currentLang === 'FR' ? 'selected' : ''}>Français</option>
                        <option value="en" ${currentLang === 'EN' ? 'selected' : ''}>English</option>
                    </select>
                </div>
            </div>
        </div>
        <div style="height: 70px;"></div>
        `;
    }
}
if (!customElements.get('djunta-header')) customElements.define('djunta-header', DjuntaHeader);
