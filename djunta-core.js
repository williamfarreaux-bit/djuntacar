/**
 * DJUNTACAR CORE ENGINE v4.0 (Architecture Clean)
 * Centralise : Config, Langues, UI, Auth, Logique.
 */

const DJUNTA = {
    // 1. CONFIGURATION CENTRALE
    config: {
        supabaseUrl: "VOTRE_URL_SUPABASE", // REMPLACEZ CECI
        supabaseKey: "VOTRE_KEY_SUPABASE", // REMPLACEZ CECI
        defaultLang: 'pt',
        currency: { code: 'CVE', symbol: 'CVE', rate: 1 } // Prêt pour le multi-devises
    },

    // 2. DICTIONNAIRE (Scalable : ajoutez autant de langues que voulu)
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

    // 3. ÉTAT (Langue active)
    state: {
        lang: localStorage.getItem('djunta_lang') || 'pt',
        session: null
    },

    // --- MÉTHODES ---

    // Initialisation
    init: async function() {
        console.log('DjuntaCar Core Starting...');
        this.renderUI();      // 1. Affiche l'interface (Header/Footer)
        this.applyLang();     // 2. Applique les textes
        this.bindEvents();    // 3. Active les boutons
        
        // 4. Supabase (Si disponible)
        if (window.supabase) {
            this.sb = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
            const { data } = await this.sb.auth.getSession();
            this.state.session = data.session;
            this.updateAuthUI(); // Met à jour le menu selon connexion
        }

        // 5. Icônes
        if (window.lucide) lucide.createIcons();
    },

    // Moteur de traduction
    t: function(key) {
        return this.i18n[this.state.lang][key] || key;
    },

    // Changement de langue
    setLang: function(lang) {
        if (this.i18n[lang]) {
            this.state.lang = lang;
            localStorage.setItem('djunta_lang', lang);
            this.applyLang(); // Pas de reload, mise à jour dynamique
            this.renderUI();  // Regénère le menu pour mettre à jour les textes
        }
    },

    // Formatage Monétaire (Scalable)
    formatMoney: function(amount) {
        return new Intl.NumberFormat(this.state.lang === 'pt' ? 'pt-CV' : 'fr-FR').format(amount) + ' ' + this.config.currency.symbol;
    },

    // Génération UI (Header & Menu)
    renderUI: function() {
        const slot = document.getElementById('app-shell');
        if (!slot) return;

        // Styles inline pour garantir l'affichage sans CSS externe chargé
        const headerHTML = `
            <header style="position:sticky; top:0; z-index:100; background:white; border-bottom:1px solid #f1f5f9; height:70px;">
                <div style="height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button id="btn-toggle-menu" style="border:none; background:none; padding:5px;"><i data-lucide="menu" style="color:#1d4379; width:26px;"></i></button>
                        <select id="lang-select" style="border:1px solid #e2e8f0; border-radius:6px; font-weight:800; color:#1d4379; font-size:11px; padding:4px;">
                            <option value="pt" ${this.state.lang === 'pt' ? 'selected' : ''}>PT 🇨🇻</option>
                            <option value="fr" ${this.state.lang === 'fr' ? 'selected' : ''}>FR 🇫🇷</option>
                            <option value="en" ${this.state.lang === 'en' ? 'selected' : ''}>EN 🇺🇸</option>
                        </select>
                    </div>
                    <img src="logo.png" style="height:28px;" onclick="window.location.href='index.html'" onerror="this.style.display='none'">
                    <div style="display:flex; gap:8px;">
                        <button onclick="window.location.href='chat-list.html'" style="border:none; background:none;"><i data-lucide="message-square" style="color:#1d4379; width:24px;"></i></button>
                        <button id="btn-profile" style="border:none; background:none;"><i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i></button>
                    </div>
                </div>
            </header>

            <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
                    <span style="font-weight:900; color:#1d4379;">MENU</span>
                    <button id="btn-close-menu" style="border:none; background:none;"><i data-lucide="x"></i></button>
                </div>
                <nav style="display:flex; flex-direction:column; gap:15px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:12px;">
                    <a href="index.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="home" style="width:18px"></i> ${this.t('nav_home')}</a>
                    <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="steering-wheel" style="width:18px"></i> ${this.t('nav_driver')}</a>
                    <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="car-front" style="width:18px"></i> ${this.t('nav_car')}</a>
                    <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="wallet" style="width:18px"></i> ${this.t('nav_wallet')}</a>
                    <hr style="border-top:1px solid #f1f5f9;">
                    <div id="auth-links">
                        </div>
                </nav>
            </div>
            <div id="menu-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none;"></div>
        `;
        
        slot.innerHTML = headerHTML;
        if(window.lucide) lucide.createIcons();
    },

    updateAuthUI: function() {
        const container = document.getElementById('auth-links');
        if (!container) return;

        if (this.state.session) {
            container.innerHTML = `
                <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="user" style="width:18px"></i> ${this.t('nav_account')}</a>
                <button id="action-logout" style="background:none; border:none; color:#ef4444; display:flex; gap:10px; font-weight:800; font-size:12px; text-transform:uppercase; cursor:pointer; margin-top:10px;"><i data-lucide="log-out" style="width:18px"></i> ${this.t('btn_logout')}</button>
            `;
            document.getElementById('action-logout').addEventListener('click', async () => {
                await this.sb.auth.signOut();
                window.location.href = 'index.html';
            });
        } else {
            container.innerHTML = `
                <a href="signup.html" style="text-decoration:none; color:#22c55e; display:flex; gap:10px;"><i data-lucide="log-in" style="width:18px"></i> ${this.t('btn_register')}</a>
                <a href="login.html" style="text-decoration:none; color:inherit; display:flex; gap:10px;"><i data-lucide="user" style="width:18px"></i> ${this.t('btn_login')}</a>
            `;
        }
        if(window.lucide) lucide.createIcons();
    },

    applyLang: function() {
        document.querySelectorAll('[data-key]').forEach(el => {
            el.innerText = this.t(el.getAttribute('data-key'));
        });
    },

    bindEvents: function() {
        const toggle = () => {
            const m = document.getElementById('mobile-menu');
            const o = document.getElementById('menu-overlay');
            if(m && o) {
                const isOpen = m.style.transform === 'translateX(0px)';
                m.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)';
                o.style.display = isOpen ? 'none' : 'block';
            }
        };

        document.getElementById('btn-toggle-menu')?.addEventListener('click', toggle);
        document.getElementById('btn-close-menu')?.addEventListener('click', toggle);
        document.getElementById('menu-overlay')?.addEventListener('click', toggle);
        
        document.getElementById('lang-select')?.addEventListener('change', (e) => this.setLang(e.target.value));

        document.getElementById('btn-profile')?.addEventListener('click', () => {
            window.location.href = this.state.session ? 'profile.html' : 'login.html';
        });
    }
};

// Auto-démarrage sécurisé
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => DJUNTA.init());
else DJUNTA.init();
