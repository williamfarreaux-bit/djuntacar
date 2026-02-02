/**
 * DJUNTACAR CORE ENGINE v5.4 (Hybrid Mode)
 * Le Header est en HTML (Fiable), le JS gère la logique.
 */

const DJUNTA = {
    // CONFIGURATION
    config: {
        supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
        supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-", // Votre clé
        defaultLang: 'pt',
        currency: { code: 'CVE', symbol: 'CVE', rate: 1 }
    },

    // LANGUES
    i18n: {
        pt: {
            nav_home: "Início", nav_driver: "Motorista", nav_car: "Carros", nav_wallet: "Carteira", nav_account: "Minha Conta",
            btn_login: "Entrar", btn_register: "Criar Conta", btn_logout: "Sair",
            hero_title: "Alugue um carro em Cabo Verde", search_placeholder: "Para onde quer ir?",
            btn_add_car: "Adicionar carro", btn_become_driver: "Ser motorista",
            footer_terms: "Termos", footer_privacy: "Privacidade",
            msg_no_car: "Nenhum veículo disponível", label_day: "/ dia"
        },
        fr: {
            nav_home: "Accueil", nav_driver: "Chauffeur", nav_car: "Voiture", nav_wallet: "Portefeuille", nav_account: "Mon Compte",
            btn_login: "Connexion", btn_register: "Inscription", btn_logout: "Déconnexion",
            hero_title: "Louez une voiture", search_placeholder: "Où allez-vous ?",
            btn_add_car: "Ajouter voiture", btn_become_driver: "Devenir chauffeur",
            footer_terms: "Conditions", footer_privacy: "Confidentialité",
            msg_no_car: "Aucun véhicule", label_day: "/ jour"
        },
        en: {
            nav_home: "Home", nav_driver: "Driver", nav_car: "Cars", nav_wallet: "Wallet", nav_account: "My Account",
            btn_login: "Login", btn_register: "Register", btn_logout: "Logout",
            hero_title: "Rent a car", search_placeholder: "Where to go?",
            btn_add_car: "Add car", btn_become_driver: "Become driver",
            footer_terms: "Terms", footer_privacy: "Privacy",
            msg_no_car: "No vehicles", label_day: "/ day"
        }
    },

    state: { lang: localStorage.getItem('djunta_lang') || 'pt', session: null },

    init: async function() {
        console.log('DjuntaCar Core: Mode Hybride');
        
        // 1. Appliquer langue et événements (Header est déjà là !)
        this.applyLang();
        this.bindEvents();
        
        // MAJ Sélecteur Langue
        const sel = document.getElementById('lang-select');
        if(sel) {
            sel.value = this.state.lang;
            sel.addEventListener('change', (e) => this.setLang(e.target.value));
        }

        // 2. Connexion Supabase
        if (window.supabase) {
            try {
                this.sb = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
                const { data } = await this.sb.auth.getSession();
                this.state.session = data.session;
                this.updateAuthUI();
            } catch (e) { console.error("Supabase Error:", e); }
        }
        
        if (window.lucide) lucide.createIcons();
    },

    t: function(key) { return (this.i18n[this.state.lang] && this.i18n[this.state.lang][key]) || key; },

    setLang: function(lang) {
        if (this.i18n[lang]) {
            this.state.lang = lang;
            localStorage.setItem('djunta_lang', lang);
            window.location.reload();
        }
    },

    formatMoney: function(amount) {
        const locale = this.state.lang === 'pt' ? 'pt-CV' : 'fr-FR';
        return new Intl.NumberFormat(locale).format(amount) + ' ' + this.config.currency.symbol;
    },

    updateAuthUI: function() {
        const container = document.getElementById('auth-links-container');
        if (!container) return;

        if (this.state.session) {
            container.innerHTML = `
                <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="user" style="width:18px"></i> ${this.t('nav_account')}</a>
                <button id="action-logout" style="background:none; border:none; color:#ef4444; display:flex; gap:10px; font-weight:800; font-size:12px; text-transform:uppercase; cursor:pointer; margin-top:10px;"><i data-lucide="log-out" style="width:18px"></i> ${this.t('btn_logout')}</button>
            `;
            setTimeout(() => { document.getElementById('action-logout')?.addEventListener('click', async () => { await this.sb.auth.signOut(); window.location.reload(); }); }, 100);
        } else {
            container.innerHTML = `
                <a href="signup.html" style="text-decoration:none; color:#22c55e; display:flex; gap:10px;"><i data-lucide="log-in" style="width:18px"></i> ${this.t('btn_register')}</a>
                <a href="login.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="user" style="width:18px"></i> ${this.t('btn_login')}</a>
            `;
        }
        if(window.lucide) lucide.createIcons();
    },

    applyLang: function() {
        document.querySelectorAll('[data-key]').forEach(el => { const k = el.getAttribute('data-key'); if(k) el.innerText = this.t(k); });
    },

    bindEvents: function() {
        const toggle = () => {
            const m = document.getElementById('mobile-menu'), o = document.getElementById('menu-overlay');
            if(m && o) { const open = m.style.transform === 'translateX(0px)'; m.style.transform = open ? 'translateX(-100%)' : 'translateX(0px)'; o.style.display = open ? 'none' : 'block'; }
        };
        document.getElementById('btn-toggle-menu')?.addEventListener('click', toggle);
        document.getElementById('btn-close-menu')?.addEventListener('click', toggle);
        document.getElementById('menu-overlay')?.addEventListener('click', toggle);
        document.getElementById('btn-profile-header')?.addEventListener('click', () => { window.location.href = this.state.session ? 'profile.html' : 'login.html'; });
    }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => DJUNTA.init());
else DJUNTA.init();
