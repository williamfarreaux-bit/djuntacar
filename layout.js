/**
 * LAYOUT AUTOMATIQUE
 * Injecte le Header et le Menu Burger sur toutes les pages au chargement.
 */

document.addEventListener("DOMContentLoaded", function() {
    injectHeader();
    injectMenu();
    
    // Initialise les icônes après injection
    if (window.lucide) window.lucide.createIcons();
});

// 1. COMMANDE : Créer le Header
function injectHeader() {
    const headerHTML = `
    <div class="header-container">
        <div class="header-side">
            <button onclick="toggleMenu()" class="p-2">
                <i data-lucide="menu" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>
        <div class="header-center">
            <img src="logo.png" alt="DjuntaCar" class="header-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <span style="display:none; font-weight:900; color:#1d4379; font-size:20px;">DJUNTACAR</span>
        </div>
        <div class="header-side">
            <button onclick="window.location.href='profile.html'" class="p-2">
                <i data-lucide="user" class="w-8 h-8 text-[#1d4379]"></i>
            </button>
        </div>
    </div>`;

    // Cherche la balise <header> existante et la remplit
    const headerElement = document.querySelector('header');
    if (headerElement) headerElement.innerHTML = headerHTML;
}

// 2. COMMANDE : Créer le Menu Burger
function injectMenu() {
    // Supprime l'ancien menu s'il existe (nettoyage)
    const oldMenu = document.getElementById('mobile-menu');
    if (oldMenu) oldMenu.remove();

    const menuHTML = `
    <div id="mobile-menu" class="fixed inset-0 bg-white z-[2000] p-8 flex flex-col transform -translate-x-full transition-transform duration-300">
        <div class="flex justify-between items-center mb-10">
            <img src="logo.png" class="h-8 object-contain" onerror="this.style.display='none'">
            <button onclick="toggleMenu()" class="p-2 bg-gray-50 rounded-full">
                <i data-lucide="x" class="w-6 h-6 text-gray-400"></i>
            </button>
        </div>
        
        <nav class="space-y-6 flex-1">
            <a href="index.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-green-500 transition-colors">
                <i data-lucide="home" class="w-6 h-6"></i> Accueil
            </a>
            <a href="search-driver.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-green-500 transition-colors">
                <i data-lucide="user-check" class="w-6 h-6"></i> Mon Chauffeur
            </a>
            <a href="search-car.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-green-500 transition-colors">
                <i data-lucide="car-front" class="w-6 h-6"></i> Ma Voiture
            </a>
            <a href="my-rentals.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-green-500 transition-colors">
                <i data-lucide="calendar" class="w-6 h-6"></i> Mes Locations
            </a>
            <a href="profile.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-green-500 transition-colors">
                <i data-lucide="user-circle" class="w-6 h-6"></i> Mon Compte
            </a>
        </nav>

        <button onclick="window.location.href='login.html'" class="flex items-center gap-2 text-xs font-black text-red-400 uppercase w-full p-2 mt-4 hover:bg-red-50 rounded-lg transition-colors">
            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
        </button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

// Fonction globale pour ouvrir/fermer
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('translate-x-0');
    // Note: on utilise translate-x-0 car Tailwind gère la classe active ainsi
    // Si vous préférez votre ancien CSS, remplacez par menu.classList.toggle('active');
};
