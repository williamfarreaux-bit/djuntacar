function applyTranslations() {
    const lang = localStorage.getItem('djuntacar_lang') || 'fr';
    
    // 1. Traduire les textes simples
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // 2. Traduire les placeholders d'inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

function switchLang(newLang) {
    localStorage.setItem('djuntacar_lang', newLang);
    applyTranslations();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', applyTranslations);
