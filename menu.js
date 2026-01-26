/**
 * DjuntaCar - Menu Centralisé
 * Ce script injecte le menu burger sur toutes les pages.
 */

document.addEventListener("DOMContentLoaded", function() {
    
    const menuHTML = `
    <div id="mobile-menu">
        <div class="flex justify-between items-center mb-10">
            <img src="logo.png" class="h-8 object-contain" onerror="this.style.display='none'">
            <button onclick="toggleMenu()" class="p-2 bg-gray-50 rounded-full">
                <i data-lucide="x" class="w-6 h-6 text-gray-400"></i>
            </button>
        </div>
        
        <nav class="space-y-6 flex-1">
            <a href="index.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-blue-600 transition-colors">
                <i data-lucide="home" class="w-6 h-6"></i> Accueil
            </a>
            
            <a href="search-driver.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-blue-600 transition-colors">
                <i data-lucide="user-check" class="w-6 h-6"></i> Mon Chauffeur
            </a>

            <a href="search-car.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-blue-600 transition-colors">
                <i data-lucide="car-front" class="w-6 h-6"></i> Ma Voiture
            </a>

            <a href="my-rentals.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-blue-600 transition-colors">
                <i data-lucide="calendar" class="w-6 h-6"></i> Mes Locations
            </a>

            <a href="profile.html" class="flex items-center gap-4 text-lg font-black text-[#1d4379] uppercase hover:text-blue-600 transition-colors">
                <i data-lucide="user-circle" class="w-6 h-6"></i> Mon Compte
            </a>
        </nav>

        <button onclick="window.location.href='login.html'" class="flex items-center gap-2 text-xs font-black text-red-400 uppercase w-full p-2 mt-4 hover:bg-red-50 rounded-lg transition-colors">
            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
        </button>
    </div>
    `;

    // Injecter le HTML à la fin du body
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // Rafraichir les icones Lucide pour le nouveau contenu
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Fonction globale pour ouvrir/fermer le menu
function toggleMenu() { 
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('active'); 
}
