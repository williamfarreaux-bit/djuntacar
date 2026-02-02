/**
 * DJUNTA MASTER ENGINE v1.8.0 (STABLE LEGACY)
 * Retour à la méthode simple d'injection.
 */

// 1. CONFIGURATION
const DJUNTA_CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
};

// 2. OBJET GLOBAL
window.DJUNTA = {
    sb: null,
    
    // Formatage Monétaire Simple
    formatMoney: function(amount) {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    },

    // Initialisation Supabase
    init: function() {
        if (window.supabase) {
            this.sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
            console.log("✅ (v1.8.0) Supabase Ready");
        } else {
            console.warn("⚠️ Supabase SDK missing");
        }
    }
};

// Lancement immédiat de l'init
window.DJUNTA.init();


// 3. GESTION DU HEADER (Méthode Classique)
document.addEventListener('DOMContentLoaded', () => {
    
    // On cible la balise personnalisée
    const target = document.querySelector('djunta-header');

    if (target) {
        // Le HTML du Header + Menu Mobile intégré
        const template = `
        <header class="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
                <div class="w-8 h-8 bg-[#1d4379] rounded-lg text-white flex items-center justify-center font-bold">D</div>
                <span class="text-[#1d4379] font-black uppercase text-sm">DjuntaCar</span>
            </div>

            <nav class="hidden md:flex gap-6 text-xs font-bold text-gray-400 uppercase">
                <a href="index.html" class="hover:text-[#1d4379]">Início</a>
                <a href="search-car.html" class="hover:text-[#1d4379]">Alugar</a>
                <a href="my-rentals.html" class="hover:text-[#1d4379]">Viagens</a>
            </nav>

            <div class="flex items-center gap-4">
                <button onclick="window.location.href='favorites.html'" class="text-gray-400 hover:text-red-500">
                    <i data-lucide="heart" class="w-5 h-5"></i>
                </button>
                
                <button id="btn-open-menu" class="md:hidden text-[#1d4379]">
                    <i data-lucide="menu" class="w-7 h-7"></i>
                </button>

                <button onclick="window.location.href='profile.html'" class="hidden md:block w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-4 h-4 text-gray-500"></i>
                </button>
            </div>
        </header>

        <div id="mobile-menu" class="hidden fixed inset-0 z-[100] bg-white pt-6 px-6 font-sans">
            <div class="flex justify-between items-center mb-10">
                <span class="text-[#1d4379] font-black uppercase text-xl">Menu</span>
                <button id="btn-close-menu" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <i data-lucide="x" class="w-6 h-6 text-gray-500"></i>
                </button>
            </div>

            <nav class="flex flex-col gap-6 text-lg font-bold text-[#1d4379]">
                <a href="index.html" class="flex items-center gap-3"><i data-lucide="home" class="w-5 h-5"></i> Início</a>
                <a href="search-car.html" class="flex items-center gap-3"><i data-lucide="search" class="w-5 h-5"></i> Alugar</a>
                <a href="driver-application.html" class="flex items-center gap-3"><i data-lucide="briefcase" class="w-5 h-5"></i> Motorista</a>
                <a href="profile.html" class="flex items-center gap-3"><i data-lucide="user" class="w-5 h-5"></i> Perfil</a>
                <a href="settings.html" class="flex items-center gap-3"><i data-lucide="settings" class="w-5 h-5"></i> Definições</a>
            </nav>

            <div class="mt-auto absolute bottom-10 left-6 right-6">
                <button onclick="window.location.href='login.html'" class="w-full h-14 bg-[#1d4379] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg">
                    Entrar
                </button>
            </div>
        </div>
        `;

        // Injection
        target.innerHTML = template;

        // Activation du Menu Mobile (Logique Simple)
        const menu = document.getElementById('mobile-menu');
        const btnOpen = document.getElementById('btn-open-menu');
        const btnClose = document.getElementById('btn-close-menu');

        if(btnOpen && menu) {
            btnOpen.addEventListener('click', () => menu.classList.remove('hidden'));
        }
        if(btnClose && menu) {
            btnClose.addEventListener('click', () => menu.classList.add('hidden'));
        }

        // Chargement des icônes
        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            setTimeout(() => window.lucide && window.lucide.createIcons(), 500);
        }
    }
});
