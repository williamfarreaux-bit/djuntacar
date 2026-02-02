/**
 * DJUNTA MASTER ENGINE v10.1
 * Mode: "Logic Only"
 * Ce fichier ne dessine plus le menu. Il gère :
 * 1. La connexion Supabase
 * 2. La traduction automatique (i18n)
 * 3. Le formatage de l'argent
 */

// 1. CONFIGURATION
const CONFIG = {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
    defaultLang: 'pt'
};

// 2. DICTIONNAIRE DE TRADUCTION
const TRANSLATIONS = {
    pt: {
        nav_home: "Início", nav_rent: "Alugar", nav_trips: "Minhas Viagens", nav_driver: "Motorista", nav_profile: "Perfil", nav_settings: "Definições",
        hero_title: "Alugue um carro em Cabo Verde",
        search_placeholder: "Para onde quer ir?",
        btn_add_car: "Adicionar carro",
        btn_become_driver: "Ser motorista",
        msg_no_car: "Nenhum veículo disponível no momento.",
        label_day: "/ dia"
    },
    fr: {
        nav_home: "Accueil", nav_rent: "Louer", nav_trips: "Mes Trajets", nav_driver: "Chauffeur", nav_profile: "Profil", nav_settings: "Paramètres",
        hero_title: "Louez une voiture au Cap-Vert",
        search_placeholder: "Où souhaitez-vous aller ?",
        btn_add_car: "Ajouter un véhicule",
        btn_become_driver: "Devenir chauffeur",
        msg_no_car: "Aucun véhicule disponible pour le moment.",
        label_day: "/ jour"
    },
    en: {
        nav_home: "Home", nav_rent: "Rent", nav_trips: "My Trips", nav_driver: "Driver", nav_profile: "Profile", nav_settings: "Settings",
        hero_title: "Rent a car in Cape Verde",
        search_placeholder: "Where do you want to go?",
        btn_add_car: "Add a car",
        btn_become_driver: "Become a driver",
        msg_no_car: "No vehicles available at the moment.",
        label_day: "/ day"
    }
};

// 3. CLASSE MOTEUR
class DjuntaEngine {
    constructor() {
        this.sb = null;
        // Récupère la langue du navigateur ou la langue par défaut
        this.lang = localStorage.getItem('djunta_lang') || CONFIG.defaultLang;
        this.dict = TRANSLATIONS[this.lang];
    }

    // Démarrage
    init() {
        console.log(`🚀 Djunta Logic v10 démarré en [${this.lang}]`);

        // A. Connexion Supabase
        if (window.supabase) {
            this.sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        } else {
            console.warn("⚠️ Supabase non chargé.");
        }

        // B. Synchroniser le sélecteur de langue HTML avec la langue actuelle
        const langSelect = document.getElementById('lang-selector');
        if (langSelect) {
            langSelect.value = this.lang;
        }

        // C. Lancer la traduction de la page
        this.translatePage();
    }

    // Fonction pour changer la langue (appelée par le <select> HTML)
    setLanguage(newLang) {
        localStorage.setItem('djunta_lang', newLang);
        window.location.reload(); // On recharge pour appliquer partout
    }

    // Fonction pour récupérer un texte précis dans le JS
    t(key) {
        return this.dict[key] || key;
    }

    // Fonction qui cherche tous les attributs data-key="..." et remplace le texte
    translatePage() {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (this.dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.dict[key];
                } else {
                    el.innerText = this.dict[key];
                }
            }
        });
    }

    // Outil de formatage monétaire (CVE)
    formatMoney(amount) {
        return new Intl.NumberFormat('pt-CV', { 
            style: 'currency', currency: 'CVE', maximumFractionDigits: 0 
        }).format(amount).replace('CVE', '').trim() + ' CVE';
    }
}

// 4. INSTANCE GLOBALE
window.DJUNTA = new DjuntaEngine();

// Lancement une fois le HTML chargé
document.addEventListener('DOMContentLoaded', () => {
    window.DJUNTA.init();
});
