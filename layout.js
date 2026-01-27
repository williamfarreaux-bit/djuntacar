/**
 * DJUNTACAR - SYSTEME DE LAYOUT (Mise à jour Langues)
 * Rôle : Injecter le header avec les 4 langues (CV, FR, PT, EN)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. On cible l'élément précis (header-slot)
    const headerSlot = document.getElementById('header-slot');
    
    if (headerSlot) {
        injectHeaderContent(headerSlot);
        injectMobileMenu(); 
        
        // Init Icônes
        if (window.lucide) window.lucide.createIcons();
        
        // Events
        setupGlobalEvents();
    } else {
        console.error("ERREUR CRITIQUE : <div id='header-slot'> manquant dans index.html");
    }
});

function injectHeaderContent(targetElement) {
    targetElement.innerHTML = `
        <header style="height: 80px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 1000;">
            <div style="width: 30%; display: flex; align-items: center; gap: 8px;">
                <button onclick="toggleMenu()" style="background:none; border:none; padding:4px; cursor:pointer;">
                    <i data-lucide="menu" style="color:#1d4379; width:28px; height:28px;"></i>
                </button>
                
                <div style="position:relative;">
                    <button onclick="toggleLang(event)" style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:8px; font-weight:900; font-size:10px; color:#1d4379; display:flex; align-items:center; gap:4px; cursor:pointer;">
                        <span id="current-lang">CV</span> <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                    </button>
                    
                    <div id="lang-dropdown" style="display:none; position:absolute; top:35px; left:0; background:white; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; z-index:5000; min-width:110px;">
                        <div onclick="setLang('CV')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">🇨🇻 Kriolu</div>
                        <div onclick="setLang('FR')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">🇫🇷 Français</div>
                        <div onclick="setLang('PT')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer; border-bottom:1px solid #f1f5f9;">🇵🇹 Português</div>
                        <div onclick="setLang('EN')" style="padding:10px; font-size:11px; font-weight:700; color:#1d4379; cursor:pointer;">🇬🇧 English</div>
                    </div>
                </div>
            </div>

            <div style="width: 40%; display
