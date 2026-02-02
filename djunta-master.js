/**
 * DJUNTA MASTER ENGINE v9.0 (FINAL RELEASE)
 * Technologie: Web Components + Tailwind CSS + IIFE Pattern
 * Fonctionnalités: Header Centralisé, Menu Mobile, Auth Supabase, Helpers Monétaires
 */

// 1. CONFIGURATION
// Note : La sécurité des données repose sur les règles RLS de Supabase.
const DJUNTA_CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-", // Clé publique
    defaultLang: 'pt'
};

// 2. CONFIGURATION DU MENU (Data-Driven)
// Modifiez ici pour changer les liens partout sur le site
const MENU_ITEMS = [
    { label: "Início", href: "index.html", icon: "home" },
    { label: "Alugar", href: "search-car.html", icon: "search" },
    { label: "Motorista", href: "driver-application.html", icon: "briefcase" },
    { label: "Viagens", href: "my-rentals.html", icon: "map-pin" },
    { label: "Meu Perfil", href: "profile.html", icon: "user" },
    { label: "Definições", href: "settings.html", icon: "settings" }
];

// 3. DJUNTA CORE MODULE (IIFE)
const DJUNTA = (() => {
    let supabaseClient = null;

    // Initialisation du client Supabase
    const init = () => {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(DJUNTA_CONFIG.supabaseUrl, DJUNTA_CONFIG.supabaseKey);
            console.log("✅ DjuntaEngine v9: Ready & Connected");
        } else {
            console.warn("⚠️ DjuntaEngine: Supabase SDK introuvable (Vérifiez le <head>).");
        }
    };

    // Helper pour formater l'argent (ex: "2 500 CVE")
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    };

    // Lancement automatique au chargement du script
    init();

    // API Publique exposée
    return {
        get sb() { return supabaseClient; }, // Getter pour compatibilité
        formatMoney,
        init
    };
})();


// 4. COMPOSANT HEADER (Web Component)
class DjuntaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initIcons();
        // Performance : Un seul écouteur pour tout le header (Event Delegation)
        this.addEventListener('click', this.handleInteraction.bind(this));
    }

    // Génère les liens pour le Desktop (Filtrés)
    getDesktopLinks() {
        const mainLinks = ["Início", "Alugar", "Viagens"];
        return MENU_ITEMS
            .filter(item => mainLinks.includes(item.label))
            .map(item => `
                <a href="${item.href}" class="hover:text-[#1d4379] transition-colors">${item.label}</a>
            `).join('');
    }

    // Génère les liens pour le Mobile (Complets avec icônes)
    getMobileLinks() {
        return MENU_ITEMS.map(item => `
            <a href="${item.href}" class="flex items-center gap-4 text-lg font-bold text-[#1d4379] p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <i data-lucide="${item.icon}" class="w-5 h-5 pointer-events-none"></i>
                </div>
                ${item.label}
            </a>
        `).join('');
    }

    render() {
        this.innerHTML = `
        <header aria-label="Menu Principal" class="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-['Montserrat']">
            
            <div class="flex items-center gap-2 cursor-pointer" role="button" data-action="go-home">
                <img src="https://via.placeholder.com/32x32/1d4379/ffffff?text=D" alt="Logo" class="w-8 h-8 rounded-lg pointer-events-none">
                <span class="text-[#1d4379] font-black uppercase text-sm tracking-tighter pointer-events-none">DjuntaCar</span>
            </div>

            <nav class="hidden md:flex gap-6 text-xs font-bold text-gray-400 uppercase">
                ${this.getDesktopLinks()}
            </nav>

            <div class="flex items-center gap-4">
                <button data-action="go-favorites" aria-label="Favoritos" class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-lucide="heart" class="w-5 h-5 pointer-events-none"></i>
                </button>
                
                <button data-action="toggle-menu" aria-expanded="false" aria-controls="mobile-menu-overlay" aria-label="Abrir menu" class="md:hidden text-[#1d4379]">
                    <i data-lucide="menu" class="w-7 h-7 pointer-events-none"></i>
                </button>

                <button data-action="go-profile" aria-label="Perfil" class="hidden md:block w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 hover:border-[#1d4379] transition-colors">
                    <i data-lucide="user" class="w-full h-full p-1 text-gray-400 pointer-events-none"></i>
                </button>
            </div>
        </header>

        <div id="mobile-menu-overlay" aria-hidden="true" class="hidden fixed inset-0 z-[100] bg-white pt-6 px-6 animate-in slide-in-from-right duration-300 font-['Montserrat']">
            
            <div class="flex justify-between items-center mb-10">
                <span class="text-[#1d4379] font-black uppercase text-xl tracking-tighter">Menu</span>
                <button data-action="close-menu" aria-label="Fechar menu" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <i data-lucide="x" class="w-6 h-6 pointer-events-none"></i>
                </button>
            </div>

            <nav class="flex flex-col gap-6">
                ${this.getMobileLinks()}
            </nav>

            <div class="mt-auto absolute bottom-10 left-6 right-6">
                <button data-action="go-login" class="w-full h-14 bg-[#1d4379] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
                    Entrar / Registar
                </button>
            </div>
        </div>
        `;
    }

    // Gestion des clics (Router interne léger)
    handleInteraction(e) {
        const trigger = e.target.closest('[data-action]');
        if (!trigger) return;

        const action = trigger.dataset.action;
        const menuOverlay = this.querySelector('#mobile-menu-overlay');
        const menuButton = this.querySelector('[data-action="toggle-menu"]');

        switch (action) {
            case 'toggle-menu':
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                this.toggleMenuState(!isExpanded, menuOverlay, menuButton);
                break;
            case 'close-menu':
                this.toggleMenuState(false, menuOverlay, menuButton);
                break;
            // Navigation
            case 'go-home': window.location.href = 'index.html'; break;
            case 'go-favorites': window.location.href = 'favorites.html'; break;
            case 'go-profile': window.location.href = 'profile.html'; break;
            case 'go-login': window.location.href = 'login.html'; break;
        }
    }

    // Gestion de l'affichage du menu (ARIA + Classes)
    toggleMenuState(isOpen, overlay, button) {
        if (isOpen) {
            overlay.classList.remove('hidden');
            overlay.setAttribute('aria-hidden', 'false');
            if(button) button.setAttribute('aria-expanded', 'true');
        } else {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
            if(button) button.setAttribute('aria-expanded', 'false');
        }
    }

    // Chargement des icônes
    initIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            window.addEventListener('load', () => {
                if(window.lucide) window.lucide.createIcons();
            });
        }
    }
}

// Enregistrement du composant Web
customElements.define('djunta-header', DjuntaHeader);
