/**
 * DJUNTA ENTERPRISE ENGINE v10.0
 * Architecture: Centralized / i18n / Scalable
 * Author: Djunta Team
 */

// ==========================================
// 1. CONFIGURATION & DICTIONNAIRE (i18n)
// ==========================================
const CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
    defaultLang: 'pt'
};

const TRANSLATIONS = {
    pt: {
        nav_home: "Início",
        nav_rent: "Alugar",
        nav_trips: "Minhas Viagens",
        nav_driver: "Motorista",
        nav_profile: "Meu Perfil",
        nav_settings: "Definições",
        btn_login: "Entrar / Registar",
        lang_select: "Idioma"
    },
    fr: {
        nav_home: "Accueil",
        nav_rent: "Louer",
        nav_trips: "Mes Trajets",
        nav_driver: "Chauffeur",
        nav_profile: "Mon Profil",
        nav_settings: "Paramètres",
        btn_login: "Connexion / Inscription",
        lang_select: "Langue"
    },
    en: {
        nav_home: "Home",
        nav_rent: "Rent Car",
        nav_trips: "My Trips",
        nav_driver: "Driver",
        nav_profile: "Profile",
        nav_settings: "Settings",
        btn_login: "Login / Sign up",
        lang_select: "Language"
    }
};

// ==========================================
// 2. CORE ENGINE CLASS
// ==========================================
class DjuntaApp {
    constructor() {
        this.sb = null; // Supabase Client
        this.lang = localStorage.getItem('djunta_lang') || CONFIG.defaultLang;
        this.t = TRANSLATIONS[this.lang];
    }

    // Initialisation globale
    init() {
        console.log(`🚀 Djunta Enterprise v10 démarré en [${this.lang.toUpperCase()}]`);
        this.initSupabase();
        this.renderHeader(); // Injecte le menu
        this.applyBodyTranslations(); // Traduit le reste de la page (optionnel)
    }

    // Connexion BDD
    initSupabase() {
        if (window.supabase) {
            this.sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        } else {
            console.warn("⚠️ Supabase SDK manquant.");
        }
    }

    // Changement de langue
    setLanguage(lang) {
        if (!TRANSLATIONS[lang]) return;
        this.lang = lang;
        localStorage.setItem('djunta_lang', lang);
        // On recharge la page pour appliquer partout proprement
        window.location.reload();
    }

    // Génération du Menu HTML
    renderHeader() {
        const target = document.querySelector('djunta-header');
        if (!target) return; // Sécurité si la balise manque

        const html = `
        <header class="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
                <div class="w-8 h-8 bg-[#1d4379] rounded-lg text-white flex items-center justify-center font-bold">D</div>
                <span class="text-[#1d4379] font-black uppercase text-sm tracking-tighter">DjuntaCar</span>
            </div>

            <nav class="hidden md:flex gap-6 text-xs font-bold text-gray-400 uppercase">
                <a href="index.html" class="hover:text-[#1d4379] transition-colors">${this.t.nav_home}</a>
                <a href="search-car.html" class="hover:text-[#1d4379] transition-colors">${this.t.nav_rent}</a>
                <a href="my-rentals.html" class="hover:text-[#1d4379] transition-colors">${this.t.nav_trips}</a>
            </nav>

            <div class="flex items-center gap-3">
                <select onchange="window.DJUNTA.setLanguage(this.value)" class="bg-gray-50 text-[10px] font-bold text-[#1d4379] py-1 px-2 rounded-lg border border-gray-200 outline-none focus:border-[#1d4379]">
                    <option value="pt" ${this.lang === 'pt' ? 'selected' : ''}>PT</option>
                    <option value="fr" ${this.lang === 'fr' ? 'selected' : ''}>FR</option>
                    <option value="en" ${this.lang === 'en' ? 'selected' : ''}>EN</option>
                </select>

                <button onclick="window.location.href='favorites.html'" class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-lucide="heart" class="w-5 h-5"></i>
                </button>
                
                <button onclick="document.getElementById('mobile-menu').classList.remove('hidden')" class="md:hidden text-[#1d4379]">
                    <i data-lucide="menu" class="w-7 h-7"></i>
                </button>
                
                <button onclick="window.location.href='profile.html'" class="hidden md:block w-8 h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden hover:border-[#1d4379]">
                    <i data-lucide="user" class="w-full h-full p-1 text-gray-400"></i>
                </button>
            </div>
        </header>

        <div id="mobile-menu" class="hidden fixed inset-0 z-[100] bg-white pt-6 px-6 font-sans animate-in slide-in-from-right duration-200">
            <div class="flex justify-between items-center mb-10">
                <span class="text-[#1d4379] font-black uppercase text-xl">Menu</span>
                <button onclick="document.getElementById('mobile-menu').classList.add('hidden')" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <nav class="flex flex-col gap-6 text-lg font-bold text-[#1d4379]">
                <a href="index.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-lucide="home" class="w-5 h-5"></i> ${this.t.nav_home}</a>
                <a href="search-car.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-lucide="search" class="w-5 h-5"></i> ${this.t.nav_rent}</a>
                <a href="driver-application.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-lucide="briefcase" class="w-5 h-5"></i> ${this.t.nav_driver}</a>
                <a href="profile.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-lucide="user" class="w-5 h-5"></i> ${this.t.nav_profile}</a>
                <a href="settings.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-lucide="settings" class="w-5 h-5"></i> ${this.t.nav_settings}</a>
            </nav>

            <div class="mt-auto absolute bottom-10 left-6 right-6">
                <button onclick="window.location.href='login.html'" class="w-full h-14 bg-[#1d4379] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
                    ${this.t.btn_login}
                </button>
            </div>
        </div>
        `;

        // Injection
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        target.replaceWith(wrapper);

        // Chargement des icônes
        if(window.lucide) window.lucide.createIcons();
        else setTimeout(() => window.lucide && window.lucide.createIcons(), 500);
    }

    // (Bonus) Système de traduction du corps de la page via data-translate
    applyBodyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.t[key]) el.innerText = this.t[key];
        });
    }

    // Helper Monétaire
    formatMoney(amount) {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    }
}

// ==========================================
// 3. EXECUTION
// ==========================================
window.DJUNTA = new DjuntaApp();

document.addEventListener('DOMContentLoaded', () => {
    window.DJUNTA.init();
});
