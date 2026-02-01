/**
 * DJUNTACAR CORE ENGINE v5.2 (STABLE)
 * Architecture: Single Source of Truth
 * Fix: Header Layout (Absolute Center) & Supabase Auth
 */

const DJUNTA = {
    // --- 1. CONFIGURATION ---
    config: {
        // Vos identifiants exacts (récupérés de nos échanges précédents)
        supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
        supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
        
        defaultLang: 'pt',
        currency: { code: 'CVE', symbol: 'CVE', rate: 1 }
    },

    // --- 2. DICTIONNAIRE (Multilingue) ---
    i18n: {
        pt: {
            nav_home: "Início", nav_driver: "Motorista", nav_car: "Carros", nav_wallet: "Carteira", nav_account: "Minha Conta",
            btn_login: "Entrar", btn_register: "Criar Conta", btn_logout: "Sair",
            hero_title: "Alugue um carro em Cabo Verde", search_placeholder: "Para onde quer ir?",
            btn_add_car: "Adicionar carro", btn_become_driver: "Ser motorista",
            footer_terms: "Termos", footer_privacy: "Privacidade",
            msg_no_car: "Nenhum veículo disponível", label_day: "/ dia",
            loading: "A carregar..."
        },
        fr: {
            nav_home: "Accueil", nav_driver: "Chauffeur", nav_car: "Voiture", nav_wallet: "Portefeuille", nav_account: "Mon Compte",
            btn_login: "Connexion", btn_register: "Inscription", btn_logout: "Déconnexion",
            hero_title: "Louez une voiture", search_placeholder: "Où allez-vous ?",
            btn_add_car: "Ajouter voiture", btn_become_driver: "Devenir chauffeur",
            footer_terms: "Conditions", footer_privacy: "Confidentialité",
            msg_no_car: "Aucun véhicule", label_day: "/ jour",
            loading: "Chargement..."
        },
        en: {
            nav_home: "Home", nav_driver: "Driver", nav_car: "Cars", nav_wallet: "Wallet", nav_account: "My Account",
            btn_login: "Login", btn_register: "Register", btn_logout: "Logout",
            hero_title: "Rent a car", search_placeholder: "Where to go?",
            btn_add_car: "Add car", btn_become_driver: "Become driver",
            footer_terms: "Terms", footer_privacy: "Privacy",
            msg_no_car: "No vehicles", label_day: "/ day",
            loading: "Loading..."
        }
    },

    // --- 3. ÉTAT INTERNE ---
    state: {
        lang: localStorage.getItem('djunta_lang') || 'pt',
        session: null
    },

    // --- 4. INITIALISATION ---
    init: async function() {
        console.log('DjuntaCar Core v5.2: Init...');
        
        // 1. Rendu immédiat de l'interface (Header/Footer)
        this.renderUI();
        this.applyLang();
        this.bindEvents();

        // 2. Connexion Supabase (Auth)
        if (window.supabase) {
            try {
                this.sb = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
                // Vérification session active
                const { data } = await this.sb.auth.getSession();
                this.state.session = data.session;
                this.updateAuthUI(); 
            } catch (e) {
                console.error("Supabase Error:", e);
            }
        }
        
        // 3. Icons
        if (window.lucide) lucide.createIcons();
    },

    // --- 5. UTILITAIRES ---
    
    // Traduction simple
    t: function(key) {
        return (this.i18n[this.state.lang] && this.i18n[this.state.lang][key]) || key;
    },

    // Changement de langue
    setLang: function(lang) {
        if (this.i18n[lang]) {
            this.state.lang = lang;
            localStorage.setItem('djunta_lang', lang);
            this.renderUI();
            this.applyLang();
            window.location.reload(); 
        }
    },

    // Formatage Monétaire
    formatMoney: function(amount) {
        const locale = this.state.lang === 'pt' ? 'pt-CV' : (this.state.lang === 'fr' ? 'fr-FR' : 'en-US');
        return new Intl.NumberFormat(locale).format(amount) + ' ' + this.config.currency.symbol;
    },

    //
