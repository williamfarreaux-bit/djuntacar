

```javascript name=djunta-master.js url=https://github.com/williamfarreaux-bit/djuntacar/blob/511c3792ceeca74432fd1db19080d5730388145c/djunta-master.js
/**
 * DJUNTACAR MASTER ENGINE (v7.0 Final - centralized header)
 * Central header injection / replacement for all HTML pages.
 *
 * - Injecte un seul header centralisé sur chaque page
 * - Remplace tous les <header> statiques par le header central
 * - Si aucun <header> n'existe, insère le header au début du <body>
 * - Initialise lucide.createIcons() après injection (si lucide chargé)
 *
 * Usage: inclure <script src="djunta-master.js" defer></script> dans le <head>.
 */

const DJUNTA = {
  // --- Configuration (exemples) ---
  config: {
    supabaseUrl: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
    supabaseKey: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-",
    defaultLang: 'pt',
    currency: { code: 'CVE', symbol: 'CVE', rate: 1 }
  },

  // --- Header HTML centralisé (template) ---
  // Modifie ce HTML si tu veux changer l'apparence du header global.
  layoutHTML: `
    <header id="djunta-header" class="djunta-header" style="position:sticky; top:0; z-index:1000; background:white; border-bottom:1px solid #f1f5f9; height:70px; width:100%;">
      <div style="position:relative; height:100%; width:100%; display:flex; align-items:center; justify-content:space-between; padding:0 16px; max-width:980px; margin:0 auto;">
        <div style="display:flex; align-items:center; gap:8px; z-index:20; height:100%;">
          <button id="btn-toggle-menu" aria-label="Menu" style="border:none; background:none; padding:8px; display:flex; align-items:center; cursor:pointer;">
            <i data-lucide="menu" style="color:#1d4379; width:26px;"></i>
          </button>
        </div>

        <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
          <a href="index.html" aria-label="Accueil" style="display:inline-flex; align-items:center; gap:10px; text-decoration:none;">
            <img src="logo.png" alt="DjuntaCar" style="height:28px;">
            <span style="color:#1d4379; font-weight:900; letter-spacing:1px; font-size:12px; text-transform:uppercase;">DjuntaCar</span>
          </a>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <select id="lang-select" aria-label="Langue" style="border:1px solid #e2e8f0; border-radius:6px; font-weight:700; color:#1d4379; font-size:12px; padding:6px;">
            <option value="pt">PT</option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>

          <button id="btn-wallet" aria-label="Portefeuille" style="border:none; background:none; padding:6px; display:flex; align-items:center; cursor:pointer;">
            <i data-lucide="wallet" style="color:#1d4379; width:22px;"></i>
          </button>

          <button id="btn-profile" aria-label="Mon profil" style="border:none; background:none; padding:6px; display:flex; align-items:center; cursor:pointer;">
            <i data-lucide="user" style="color:#1d4379; width:22px;"></i>
          </button>
        </div>
      </div>
    </header>
  `,

  // --- Init: injection centralisée et setup ---
  init: function () {
    console.log('DJUNTA: démarrage de l\'injection du header centralisé...');

    try {
      // Crée un container pour le layout centralisé
      const container = document.createElement('div');
      container.id = 'djunta-layout';
      container.innerHTML = this.layoutHTML;

      // Récupère tous les headers existants
      const existingHeaders = Array.from(document.getElementsByTagName('header') || []);

      if (existingHeaders.length > 0) {
        // Remplace le premier <header> par notre container
        const firstHeader = existingHeaders[0];
        if (firstHeader && firstHeader.parentNode) {
          firstHeader.parentNode.replaceChild(container, firstHeader);
          console.info('DJUNTA: header statique remplacé par header centralisé (first header).');
        } else {
          // fallback si parentNode absent
          (document.body || document.getElementsByTagName('body')[0]).insertBefore(container, (document.body || document.getElementsByTagName('body')[0]).firstChild);
          console.warn('DJUNTA: remplacement header fallback (parentNode absent).');
        }

        // Supprime tout autre header restant (pour éviter duplication)
        for (let i = 1; i < existingHeaders.length; i++) {
          const h = existingHeaders[i];
          if (h && h.parentNode) {
            h.parentNode.removeChild(h);
          }
        }
      } else {
        // Aucun header présent: insère le container en début du body
        const body = document.body || document.getElementsByTagName('body')[0];
        if (body) {
          body.insertBefore(container, body.firstChild);
          console.info('DJUNTA: header injecté en début du body (fallback insertion).');
        } else {
          console.error('DJUNTA: body introuvable — injection impossible.');
        }
      }

      // Post-injection: initialisation des icônes lucide (retry si non prêt)
      this._initLucideIconsWithRetry();

      // Bind UI handlers (menu toggles, lang change...) si nécessaire
      this._attachUiHandlers();

    } catch (err) {
      console.error('DJUNTA: erreur durant l\'injection du header :', err);
    }
  },

  // --- Helper: initialize lucide icons with retries ---
  _initLucideIconsWithRetry: function (retries = 6, delay = 300) {
    const tryInit = () => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try {
          window.lucide.createIcons();
          console.info('DJUNTA: lucide.createIcons() exécuté.');
        } catch (e) {
          console.warn('DJUNTA: erreur lors de lucide.createIcons():', e);
        }
        return true;
      }
      return false;
    };

    if (!tryInit()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (tryInit() || attempts >= retries) {
          clearInterval(interval);
          if (attempts >= retries) {
            console.warn('DJUNTA: lucide non disponible après multiples tentatives.');
          }
        }
      }, delay);
    }
  },

  // --- Helper: attach minimal UI handlers (non invasif) ---
  _attachUiHandlers: function () {
    // Exemple: menu toggle basique (peut être personnalisé)
    const btnMenu = document.getElementById('btn-toggle-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', (e) => {
        // Emission d'un event custom pour que la page gère l'ouverture du menu
        const ev = new CustomEvent('djunta:toggle-menu', { detail: {} });
        window.dispatchEvent(ev);
      });
    }

    // Lang select handler (met à jour localStorage et déclenche event)
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      // set default value from config or localStorage
      const stored = localStorage.getItem('djunta_lang') || this.config.defaultLang;
      langSelect.value = stored;
      langSelect.addEventListener('change', (e) => {
        localStorage.setItem('djunta_lang', e.target.value);
        const ev = new CustomEvent('djunta:lang-changed', { detail: { lang: e.target.value } });
        window.dispatchEvent(ev);
      });
    }

    // Wallet/profile buttons can dispatch events; pages can listen and react.
    const btnWallet = document.getElementById('btn-wallet');
    if (btnWallet) {
      btnWallet.addEventListener('click', () => window.dispatchEvent(new CustomEvent('djunta:open-wallet')));
    }
    const btnProfile = document.getElementById('btn-profile');
    if (btnProfile) {
      btnProfile.addEventListener('click', () => window.dispatchEvent(new CustomEvent('djunta:open-profile')));
    }
  }
};

// Expose DJUNTA globally
window.DJUNTA = DJUNTA;

// Lancement automatique quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DJUNTA.init());
} else {
  // DOM déjà prêt
  setTimeout(() => DJUNTA.init(), 0);
}
```
