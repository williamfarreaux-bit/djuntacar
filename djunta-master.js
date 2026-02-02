// VERSION DE SECOURS - DJUNTA MASTER ENGINE v9.1
// Cette version n'utilise pas de Web Component complexe pour éviter les bugs.
// Elle injecte simplement le HTML au chargement.

console.log("🚀 Djunta Engine v9.1 : Démarrage...");

// 1. CONFIGURATION SUPABASE
const DJUNTA_CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
};

// 2. LOGIQUE GLOBALE (Supabase & Helpers)
window.DJUNTA = {
    sb: null,
    formatMoney: function(amount) {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    }
};

// Connexion Supabase
if (window.supabase) {
    window.DJUNTA.sb = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
    console.log("✅ Supabase Connecté");
} else {
    console.warn("⚠️ Supabase non chargé (vérifiez votre <head>)");
}

// 3. INJECTION DU MENU (Au chargement de la page)
document.addEventListener("DOMContentLoaded", function() {
    
    // On cherche la balise <djunta-header> dans le HTML
    const placeholder = document.querySelector('djunta-header');

    if (!placeholder) {
        console.error("❌ ERREUR : Balise <djunta-header> introuvable dans le body !");
        return;
    }

    console.log("🔧 Balise trouvée, injection du menu...");

    // Le Code HTML du Menu (Desktop + Mobile)
    const menuHTML = `
    <header class="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
        
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='index.html'">
             <div class="w-8 h-8 bg-[#1d4379] rounded-lg text-white flex items-center justify-center font-bold">D</div>
             <span class="text-[#1d4379] font-black uppercase text-sm tracking-tighter">DjuntaCar</span>
        </div>
        
        <nav class="hidden md:flex gap-6 text-xs font-bold text-gray-400 uppercase">
            <a href="index.html" class="hover:text-[#1d4379] transition-colors">Início</a>
            <a href="search-car.html" class="hover:text-[#1d4379] transition-colors">Alugar</a>
            <a href="my-rentals.html" class="hover:text-[#1d4379] transition-colors">Viagens</a>
        </nav>

        <div class="flex items-center gap-4">
            <button onclick="window.location.href='favorites.html'" class="text-gray-400 hover:text-red-500 transition-colors">
                <i data-lucide="heart" class="w-5 h-5"></i>
            </button>
            
            <button onclick="document.getElementById('mobile-menu-overlay').classList.remove('hidden')" class="md:hidden text-[#1d4379]">
                <i data-lucide="menu" class="w-7 h-7"></i>
            </button>
            
            <button onclick="window.location.href='profile.html'" class="hidden md:block w-8 h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden hover:border-[#1d4379]">
                <i data-lucide="user" class="w-full h-full p-1 text-gray-400"></i>
            </button>
        </div>
    </header>

    <div id="mobile-menu-overlay" class="hidden fixed inset-0 z-[100] bg-white pt-6 px-6 font-sans">
        <div class="flex justify-between items-center mb-10">
            <span class="text-[#1d4379] font-black uppercase text-xl">Menu</span>
            <button onclick="document.getElementById('mobile-menu-overlay').classList.add('hidden')" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>

        <nav class="flex flex-col gap-6 text-lg font-bold text-[#1d4379]">
            <a href="index.html" class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl"><i data-luc
