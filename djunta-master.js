/**
 * DJUNTACAR MASTER ENGINE v7.0
 * FICHIER RENOMMÉ POUR FORCER LA MISE À JOUR
 */

const DJUNTA = {
    // 1. CONFIGURATION
    config: {
        supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
        supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
        defaultLang: 'pt',
        currency: { code: 'CVE', symbol: 'CVE', rate: 1 }
    },

    // 2. HTML DU HEADER (AVEC ICÔNE VOLANT)
    layoutHTML: `
        <header style="position:sticky; top:0; z-index:100; background:white; border-bottom:1px solid #f1f5f9; height:70px; width:100%;">
            <div style="position:relative; height:100%; width:100%; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:600px; margin:0 auto;">
                
                <div style="display:flex; align-items:center; gap:8px; z-index:20; height:100%;">
                    <button id="btn-toggle-menu" style="border:none; background:none; padding:5px; display:flex; align-items:center; cursor:pointer;">
                        <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
                    </button>
                    <select id="lang-select" style="border:1px solid #e2e8f0; border-radius:6px; font-weight:800; color:#1d4379; font-size:10px; padding:4px; cursor:pointer;">
                        <option value="pt">PT 🇨🇻</option>
                        <option value="fr">FR 🇫🇷</option>
                        <option value="en">EN 🇺🇸</option>
                    </select>
                </div>

                <div style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); z-index:10; display:flex; align-items:center;">
                    <img src="logo.png" style="height:26px; display:block; cursor:pointer;" onclick="window.location.href='index.html'" onerror="this.outerHTML='<b style=\'color:#1d4379\'>DJUNTA</b>'">
                </div>

                <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px; z-index:20; height:100%;">
                    <button onclick="window.location.href='chat-list.html'" style="border:none; background:none; display:flex; align-items:center; cursor:pointer;">
                        <i data-lucide="message-square" style="color:#1d4379; width:24px;"></i>
                    </button>
                    <button id="btn-profile-header" style="border:none; background:none; display:flex; align-items:center; cursor:pointer;">
                        <i data-lucide="user-circle" style="color:#1d4379; width:26px;"></i>
                    </button>
                </div>
            </div>
        </header>

        <div id="mobile-menu" style="position:fixed; top:0; left:0; bottom:0; width:280px; background:white; z-index:2000; padding:24px; display:flex; flex-direction:column; transform:translateX(-100%); transition:transform 0.3s ease; box-shadow:10px 0 30px rgba(0,0,0,0.1);">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <span style="font-weight:900; color:#1d4379; font-size:14px; letter-spacing:1px; border: 1px solid red; padding: 2px;">MENU V7</span>
                <button id="btn-close-menu" style="border:none; background:none; cursor:pointer; padding:5px;">
                    <i data-lucide="x" style="width:24px; color:#1d4379;"></i>
                </button>
            </div>

            <nav style="display:flex; flex-direction:column; gap:20px; font-weight:800; color:#1d4379; text-transform:uppercase; font-size:12px;">
                
                <a href="index.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px;">
                    <i data-lucide="home" style="width:20px; height:20px;"></i> 
                    <span data-key="nav_home">Início</span>
                </a>

                <a href="search-driver.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px;">
                    <i data-lucide="steering-wheel" style="width:20px; height:20px;"></i> 
                    <span data-key="nav_driver">Motorista</span>
                </a>

                <a href="search-car.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px;">
                    <i data-lucide="car-front" style="width:20px; height:20px;"></i> 
                    <span data-key="nav_car">Carros</span>
                </a>

                <a href="wallet.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px;">
                    <i data-lucide="wallet" style="width:20px; height:20px;"></i> 
                    <span data-key="nav_wallet">Carteira</span>
                </a>

                <hr style="border-top:1px solid #f1f5f9; margin:10px 0;">
                
                <div id="auth-links-container" style="display:flex; flex-direction:column; gap:20px;"></div>
            </nav>
        </div>
        <div id="menu-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1999; display:none;"></div>
    `,

    // 3. DICTIONNAIRE
    i18n: {
        pt: { nav_home: "Início", nav_driver: "Motorista", nav_car: "Carros", nav_wallet: "Carteira", nav_account: "Minha Conta", btn_login: "Entrar", btn_register: "Criar Conta", btn_logout: "Sair", hero_title: "Alugue um carro em Cabo Verde", search_placeholder: "Para onde quer ir?", btn_add_car: "Adicionar carro", btn_become_driver: "Ser motorista", footer_terms: "Termos", footer_privacy: "Privacidade", msg_no_car: "Nenhum veículo disponível", label_day: "/ dia" },
        fr: { nav_home: "Accueil", nav_driver: "Chauffeur", nav_car: "Voiture", nav_wallet: "Portefeuille", nav_account: "Mon Compte", btn_login: "Connexion", btn_register: "Inscription", btn_logout: "Déconnexion", hero_title: "Louez une voiture", search_placeholder: "Où allez-vous ?", btn_add_car: "Ajouter voiture", btn_become_driver: "Devenir chauffeur", footer_terms: "Conditions", footer_privacy: "Confidentialité", msg_no_car: "Aucun véhicule", label_day: "/ jour" },
        en: { nav_home: "Home", nav_driver: "Driver", nav_car: "Cars", nav_wallet: "Wallet", nav_account: "My Account", btn_login: "Login", btn_register: "Register", btn_logout: "Logout", hero_title: "Rent a car", search_placeholder: "Where to go?", btn_add_car: "Add car", btn_become_driver: "Become driver", footer_terms: "Terms", footer_privacy: "Privacy", msg_no_car: "No vehicles", label_day: "/ day" }
    },

    // 4. ÉTAT
    state: { lang: localStorage.getItem('djunta_lang') || 'pt', session: null },

    // 5. INITIALISATION
    init: async function() {
        console.log('DjuntaCar MASTER: Injection UI...');
        
        const target = document.getElementById('djunta-layout');
        if(target) {
            target.innerHTML = this.layoutHTML;
        } else {
            console.error("ERREUR CRITIQUE: <div id='djunta-layout'> introuvable !");
            return;
        }

        this.applyLang();
        this.bindEvents();
        this.bindLanguage();

        if (window.supabase) {
            try {
                this.sb = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
                const { data } = await this.sb.auth.getSession();
                this.state.session = data.session;
                this.updateAuthUI();
            } catch (e) { console.error(e); }
        }
        
        if (window.lucide) {
            lucide.createIcons();
            // DOUBLE CHECK pour forcer l'affichage
            setTimeout(() => lucide.createIcons(), 300);
        }
    },

    // 6. FONCTIONS
    t: function(key) { return (this.i18n[this.state.lang] && this.i18n[this.state.lang][key]) || key; },
    
    setLang: function(lang) {
        if (this.i18n[lang]) {
            this.state.lang = lang;
            localStorage.setItem('djunta_lang', lang);
            window.location.reload();
        }
    },

    bindLanguage: function() {
        const sel = document.getElementById('lang-select');
        if (sel) {
            sel.value = this.state.lang;
            sel.onchange = (e) => this.setLang(e.target.value);
        }
    },

    formatMoney: function(amount) {
        const locale = this.state.lang === 'pt' ? 'pt-CV' : (this.state.lang === 'fr' ? 'fr-FR' : 'en-US');
        return new Intl.NumberFormat(locale).format(amount) + ' ' + this.config.currency.symbol;
    },

    updateAuthUI: function() {
        const container = document.getElementById('auth-links-container');
        if (!container) return;
        
        const style = "text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px;";

        if (this.state.session) {
            container.innerHTML = `
                <a href="profile.html" style="${style}"><i data-lucide="user" style="width:20px; height:20px;"></i> ${this.t('nav_account')}</a>
                <button id="action-logout" style="background:none; border:none; color:#ef4444; display:flex; align-items:center; gap:12px; font-weight:800; font-size:12px; text-transform:uppercase; cursor:pointer; margin-top:10px;"><i data-lucide="log-out" style="width:20px; height:20px;"></i> ${this.t('btn_logout')}</button>
            `;
            setTimeout(() => { document.getElementById('action-logout')?.addEventListener('click', async () => { await this.sb.auth.signOut(); window.location.reload(); }); }, 100);
        } else {
            container.innerHTML = `
                <a href="signup.html" style="text-decoration:none; color:#22c55e; display:flex; align-items:center; gap:12px;"><i data-lucide="log-in" style="width:20px; height:20px;"></i> ${this.t('btn_register')}</a>
                <a href="login.html" style="${style}"><i data-lucide="user" style="width:20px; height:20px;"></i> ${this.t('btn_login')}</a>
            `;
        }
        if(window.lucide) lucide.createIcons();
    },

    applyLang: function() {
        document.querySelectorAll('[data-key]').forEach(el => { const k = el.getAttribute('data-key'); if(k) el.innerText = this.t(k); });
        const f = document.getElementById('app-footer');
        if(f) { const t = f.querySelector('a[href="terms.html"]'); if(t) t.innerText = this.t('footer_terms'); const p = f.querySelector('a[href="privacy.html"]'); if(p) p.innerText = this.t('footer_privacy'); }
    },

    bindEvents: function() {
        const toggle = () => { const m = document.getElementById('mobile-menu'), o = document.getElementById('menu-overlay'); if(m && o) { const open = m.style.transform === 'translateX(0px)'; m.style.transform = open ? 'translateX(-100%)' : 'translateX(0px)'; o.style.display = open ? 'none' : 'block'; if(!open && window.lucide) setTimeout(() => lucide.createIcons(), 50); } };
        document.getElementById('btn-toggle-menu')?.addEventListener('click', toggle);
        document.getElementById('btn-close-menu')?.addEventListener('click', toggle);
        document.getElementById('menu-overlay')?.addEventListener('click', toggle);
        document.getElementById('btn-profile-header')?.addEventListener('click', () => { window.location.href = this.state.session ? 'profile.html' : 'login.html'; });
    }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => DJUNTA.init()); else DJUNTA.init();
