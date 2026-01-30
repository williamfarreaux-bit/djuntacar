/**
 * DjuntaCar - Global Application Logic
 * Gestion PWA, Formatage, UI Utilities & Business Logic (Âge/Permis)
 */

// ==================================================
// 1. GESTION PWA (INSTALLATION MOBILE)
// ==================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('DjuntaCar PWA: ServiceWorker enregistré');
            })
            .catch(error => {
                console.log('DjuntaCar PWA: Échec SW', error);
            });
    });
}

// ==================================================
// 2. UTILITAIRES DE FORMATAGE
// ==================================================

/**
 * Formate un nombre en Escudo Cap-Verdien (CVE)
 */
function formatMoney(amount) {
    if (!amount) return '0 CVE';
    return new Intl.NumberFormat('pt-CV', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount) + ' CVE';
}

/**
 * Formate une date au format lisible (ex: 24 janv. 2026)
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// ==================================================
// 3. LOGIQUE MÉTIER : VÉRIFICATION ÉLIGIBILITÉ
// ==================================================

/**
 * Calcule l'ancienneté en années à partir d'une date
 * @param {string} dateString - Format YYYY-MM-DD
 */
function getYearsSince(dateString) {
    if (!dateString) return 0;
    const today = new Date();
    const pastDate = new Date(dateString);
    let diff = today.getFullYear() - pastDate.getFullYear();
    const m = today.getMonth() - pastDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < pastDate.getDate())) {
        diff--;
    }
    return diff;
}

/**
 * Vérifie si l'utilisateur peut louer selon les règles de DjuntaCar
 * Règles : 19 ans minimum + 1 an de permis minimum
 * @param {Object} profile - Données du profil Supabase
 * @param {string} locationName - Nom de l'île ou du pays
 */
async function checkRentalEligibility(profile, locationName) {
    // 1. Calcul des âges
    const age = getYearsSince(profile.birth_date);
    const licenseYears = getYearsSince(profile.license_issue_date);

    // 2. Récupération des règles spécifiques en base (via le config global)
    const { data: rule, error } = await supabase
        .from('legal_majority')
        .select('min_driving_age, min_license_years')
        .eq('entity_name', locationName)
        .single();

    // Valeurs par défaut si la règle n'est pas trouvée
    const requiredAge = rule?.min_driving_age || 19;
    const requiredLicense = rule?.min_license_years || 1;

    // 3. Verdict
    if (age < requiredAge) {
        showToast(`Âge insuffisant : ${requiredAge} ans minimum requis.`, "error");
        return false;
    }

    if (licenseYears < requiredLicense) {
        showToast(`Permis trop récent : ${requiredLicense} an d'ancienneté minimum.`, "error");
        return false;
    }

    return true;
}

// ==================================================
// 4. SYSTÈME DE NOTIFICATION (TOAST)
// ==================================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    
    let baseClass = "fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] text-xs font-black uppercase transition-all duration-500 ease-out flex items-center gap-2 translate-y-[-100px] opacity-0";
    
    if (type === 'success') {
        toast.className = `${baseClass} bg-[#22c55e] text-white`;
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
    } else if (type === 'error') {
        toast.className = `${baseClass} bg-[#ef4444] text-white`;
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ${message}`;
    } else {
        toast.className = `${baseClass} bg-[#1d4379] text-white`;
        toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> ${message}`;
    }

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-100px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
