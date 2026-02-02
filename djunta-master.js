/**
 * DJUNTA ENTERPRISE ENGINE v10.0
 * Gestion Centralisée + Traduction (i18n) + Supabase
 */

// 1. DICTIONNAIRE DE LANGUES (Tout le texte du site est ici)
const TRANSLATIONS = {
    pt: {
        // Menu
        nav_home: "Início",
        nav_rent: "Alugar",
        nav_trips: "Minhas Viagens",
        nav_driver: "Motorista",
        nav_profile: "Perfil",
        nav_settings: "Definições",
        btn_login: "Entrar / Registar",
        // Page Accueil
        hero_title: "Alugue um carro em Cabo Verde",
        search_placeholder: "Para onde quer ir?",
        btn_add_car: "Adicionar carro",
        btn_become_driver: "Ser motorista",
        msg_no_car: "Nenhum veículo disponível no momento.",
        label_day: "/ dia",
        // Footer
        footer_terms: "TERMOS",
        footer_privacy: "PRIVACIDADE"
    },
    fr: {
        nav_home: "Accueil",
        nav_rent: "Louer",
        nav_trips: "Mes Trajets",
        nav_driver: "Chauffeur",
        nav_profile: "Profil",
        nav_settings: "Paramètres",
        btn_login: "Connexion",
        hero_title: "Louez une voiture au Cap-Vert",
        search_placeholder: "Où souhaitez-vous aller ?",
        btn_add_car: "Ajouter un véhicule",
        btn_become_driver: "Devenir chauffeur",
        msg_no_car: "Aucun véhicule disponible pour le moment.",
        label_day: "/ jour",
        footer_terms: "CONDITIONS",
        footer_privacy: "CONFIDENTIALITÉ"
    },
    en: {
        nav_home: "Home",
        nav_rent: "Rent",
        nav_trips: "My Trips",
        nav_driver: "Driver",
        nav_profile: "Profile",
        nav_settings: "Settings",
        btn_login: "Login",
        hero_title: "Rent a car in Cape Verde",
        search_placeholder: "Where do you want to go?",
        btn_add_car: "Add a car",
        btn_become_driver: "Become a driver",
        msg_no_car: "No vehicles available at the moment.",
        label_day: "/ day",
        footer_terms: "TERMS",
        footer_privacy: "PRIVACY"
    }
};

// 2. CONFIGURATION
const CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
    defaultLang: 'pt'
};

// 3. LE CERVEAU (CLASSE PRINCIPALE)
class DjuntaEngine {
    constructor() {
        this.sb = null;
        // Récupère la langue sauvegardée ou utilise la langue par défaut
        this.lang = localStorage.getItem('djunta_lang') || CONFIG.defaultLang;
        this.dict = TRANSLATIONS[this.lang];
    }

    init() {
        console.log(`🚀 Engine v10 Started [${this.lang}]`);
        
        // Connexion Supabase
        if (window.supabase) {
            this.sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        }

        // Injection du Menu
        this.renderLayout();

        // Traduction de la page
        this.translatePage();
    }

    // Helper de traduction (Utilisé dans ton HTML: DJUNTA.t('key'))
    t(key) {
        return this.dict[key] || key;
    }

    // Change la langue et recharge
    setLanguage(lang) {
        localStorage.setItem('djunta_lang', lang);
        window.location.reload();
    }

    // Traduit tous les éléments avec data-key="..."
    translatePage() {
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (this.dict[key]) {
                // Si c'est un input, on change le placeholder, sinon le texte
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.dict[key];
                } else {
                    el.innerText = this.dict[key];
                }
            }
        });
    }

    // Injecte le Header dans <div id="djunta-layout">
    renderLayout() {
        const container = document.getElementById('djunta-layout');
        if (!container) return;

        container.innerHTML = `
        <header class="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
                 <div class="w-8 h-8 bg-[#1d4379] rounded-lg text-white flex items-center justify-center font-bold">D</div>
                 <span class="text-[#1d4379] font-black uppercase text-sm tracking-tighter">DjuntaCar</span>
            </div>

            <nav class="hidden md:flex gap-6 text-xs font-bold text-gray-400 uppercase">
                <a href="index.html" class="hover:text-[#1d4379]">${this.t('nav_home')}</a>
                <a href="search-car.html" class="hover:text-[#1d4379]">${this.t('nav_rent')}</a>
                <a href="my-rentals.html" class="hover:text-[#1d4379]">${this.t('nav_trips')}</a>
            </nav>

            <div class="flex items-center gap-3">
                <select onchange="DJUNTA.setLanguage(this.value)" class="bg-gray-50 text-[10px] font-bold text-[#1d4379] py-1 px-2 rounded-lg border border-gray-200 outline-none">
                    <option value="pt" ${this.lang === 'pt' ? 'selected' : ''}>PT</option>
                    <option value="fr" ${this.lang === 'fr' ? 'selected' : ''}>FR</option>
                    <option value="en" ${this.lang === 'en' ? 'selected' : ''}>EN</option>
                </select>

                <button onclick="window.location.href='favorites.html'" class="text-gray-400 hover:text-red-500">
                    <i data-lucide="heart" class="w-5 h-5"></i>
                </button>
                
                <button onclick="document.getElementById('mobile-menu').classList.remove('hidden')" class="md:hidden text-[#1d4379]">
                    <i data-lucide="menu" class="w-7 h-7"></i>
                </button>
                
                <button onclick="window.location.href='profile.html'" class="hidden md:block w-8 h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
                    <i data-lucide="user" class="w-full h-full p-1 text-gray-400"></i>
                </button>
            </div>
        </header>

        <div id="mobile-menu" class="hidden fixed inset-0 z-[100] bg-white pt-6 px-6 animate-in slide-in-from-right duration-200 font-sans">
            <div class="flex justify-between items-center mb-10">
                <span class="text-[#1d4379] font-black uppercase text-xl">Menu</span>
                <button onclick="document.getElementById('mobile-menu').classList.add('hidden')" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <nav class="flex flex-col gap-6 text-lg font-bold text-[#1d4379]">
                <a href="index.html" class="flex items-center gap-4"><i data-lucide="home" class="w-5 h-5"></i> ${this.t('nav_home')}</a>
                <a href="search-car.html" class="flex items-center gap-4"><i data-lucide="search" class="w-5 h-5"></i> ${this.t('nav_rent')}</a>
                <a href="driver-application.html" class="flex items-center gap-4"><i data-lucide="briefcase" class="w-5 h-5"></i> ${this.t('nav_driver')}</a>
                <a href="profile.html" class="flex items-center gap-4"><i data-lucide="user" class="w-5 h-5"></i> ${this.t('nav_profile')}</a>
                <a href="settings.html" class="flex items-center gap-4"><i data-lucide="settings" class="w-5 h-5"></i> ${this.t('nav_settings')}</a>
            </nav>

            <div class="mt-auto absolute bottom-10 left-6 right-6">
                <button onclick="window.location.href='login.html'" class="w-full h-14 bg-[#1d4379] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
                    ${this.t('btn_login')}
                </button>
            </div>
        </div>
        `;
        
        // Charge les icônes du menu injecté
        if(window.lucide) window.lucide.createIcons();
    }
}

// 4. DÉMARRAGE
window.DJUNTA = new DjuntaEngine();
document.addEventListener('DOMContentLoaded', () => window.DJUNTA.init());
