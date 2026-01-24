import { supabase } from './services/supabase.js';

// 1. ÉTAT GLOBAL
let state = {
    vehicles: [],
    filterIsland: 'all',
    filterCategory: 'all',
    currency: 'CVE'
};

const currencyRates = {
    CVE: 1,
    EUR: 0.0090, // 1000 CVE = 9€
    USD: 0.0097  // 1000 CVE = 9.7$
};

// 2. FONCTIONS DE CHARGEMENT
async function fetchVehicles() {
    const grid = document.getElementById('vehicle-grid');
    
    // Loader visuel
    grid.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-gray-400">
            <i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-2 text-[#1d4379]"></i>
            <span class="text-xs">Chargement du parc auto...</span>
        </div>`;
    if(window.lucide) window.lucide.createIcons();

    try {
        // REQUÊTE SUPABASE RÉELLE
        // On ne prend que les véhicules actifs
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        state.vehicles = data;
        renderGrid();

    } catch (err) {
        console.error("Erreur:", err);
        grid.innerHTML = `
            <div class="p-4 text-center bg-red-50 text-red-500 rounded-xl border border-red-100 mx-4">
                <p class="font-bold">Erreur de connexion</p>
                <p class="text-xs opacity-75">Impossible de charger les véhicules.</p>
            </div>`;
    }
}

// 3. MOTEUR DE RENDU
function renderGrid() {
    const grid = document.getElementById('vehicle-grid');
    
    // Filtrage
    const filtered = state.vehicles.filter(car => {
        const matchIsland = state.filterIsland === 'all' || car.island === state.filterIsland;
        const matchCat = state.filterCategory === 'all' || car.category === state.filterCategory;
        return matchIsland && matchCat;
    });

    // Affichage Vide
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="car-front" class="w-8 h-8 opacity-50"></i>
                </div>
                <p class="font-medium text-gray-600">Aucun véhicule trouvé.</p>
                <p class="text-xs mt-1">Essayez une autre île ou catégorie.</p>
            </div>`;
    } else {
        // Génération des cartes
        grid.innerHTML = filtered.map(car => vehicleCardComponent(car)).join('');
    }
    
    if (window.lucide) window.lucide.createIcons();
}

function vehicleCardComponent(car) {
    // Gestion de l'image (Fallback si pas d'image ou erreur)
    let imgUrl = 'assets/placeholder.jpg';
    if (car.images_url && car.images_url.length > 0) {
        imgUrl = car.images_url[0];
    }

    // Calcul Prix
    const rate = currencyRates[state.currency];
    const price = (car.price_per_day * rate).toFixed(state.currency === 'CVE' ? 0 : 0);
    const symbol = state.currency === 'EUR' ? '€' : state.currency === 'USD' ? '$' : 'CVE';

    // Badge Transmission
    const transIcon = car.transmission === 'Automatique' ? 'zap' : 'joystick';

    return `
    <div onclick="alert('Bientôt : Page détail pour ${car.make} ${car.model}')" 
         class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-all duration-200 hover:shadow-md group">
        
        <div class="relative h-48 bg-gray-200 overflow-hidden">
            <img src="${imgUrl}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            
            <div class="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#1d4379] shadow-sm">
                ${price} <small class="text-gray-500 font-normal">/j</small> ${symbol}
            </div>
            
            <div class="absolute bottom-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5 backdrop-blur-md border border-white/10">
                <i data-lucide="map-pin" class="w-3 h-3 text-[#76B852]"></i> ${car.island}
            </div>
        </div>

        <div class="p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-gray-900 leading-tight">${car.make} ${car.model}</h3>
            </div>
            
            <div class="flex gap-3 text-xs text-gray-500 border-t border-gray-50 pt-3 mt-2">
                <span class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <i data-lucide="fuel" class="w-3.5 h-3.5 text-[#1d4379]"></i> ${car.fuel_type}
                </span>
                <span class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <i data-lucide="${transIcon}" class="w-3.5 h-3.5 text-[#1d4379]"></i> ${car.transmission}
                </span>
                <span class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <i data-lucide="users" class="w-3.5 h-3.5 text-[#1d4379]"></i> ${car.seats}
                </span>
            </div>
        </div>
    </div>`;
}

// 4. EXPOSITION DES FONCTIONS (Pour les onclick HTML)
window.setLanguage = () => {
    // À connecter plus tard avec i18n
    alert("Changement de langue : fonctionnalité Sprint 3");
};

window.setCurrency = () => {
    state.currency = document.getElementById('currency-select').value;
    renderGrid();
};

window.setIsland = () => {
    state.filterIsland = document.getElementById('island-select').value;
    renderGrid();
};

window.setCategory = (cat, btn) => {
    state.filterCategory = cat;
    // Reset styles
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.className = "cat-btn bg-white text-gray-600 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm border border-gray-100 transition-all";
    });
    // Active style
    btn.className = "cat-btn bg-[#1d4379] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all transform scale-105";
    renderGrid();
};

// Démarrage
document.addEventListener('DOMContentLoaded', fetchVehicles);
