/**
 * SCRIPT DE DIAGNOSTIC SUPABASE
 * 
 * À utiliser dans la console du navigateur pour tester la connexion à Supabase.
 * 
 * USAGE:
 * 1. Ouvrir la console du navigateur (F12)
 * 2. Copier/coller ce script dans la console
 * 3. Attendre les résultats du diagnostic
 */

(async function runSupabaseDiagnostic() {
    console.log("🔍 ==== DIAGNOSTIC SUPABASE DJUNTACAR ====\n");
    
    const results = {
        errors: [],
        warnings: [],
        success: []
    };

    // TEST 1: Vérifier que la bibliothèque Supabase est chargée
    console.log("📦 Test 1: Vérification bibliothèque Supabase...");
    if (typeof window.supabase !== 'undefined') {
        results.success.push("✅ Bibliothèque Supabase chargée");
        console.log("   ✅ window.supabase existe");
    } else {
        results.errors.push("❌ Bibliothèque Supabase NON chargée");
        console.error("   ❌ window.supabase n'existe pas");
        console.log("   💡 Ajoutez: <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script>");
    }

    // TEST 2: Vérifier que window.DJUNTA existe
    console.log("\n📦 Test 2: Vérification namespace DJUNTA...");
    if (typeof window.DJUNTA !== 'undefined') {
        results.success.push("✅ Namespace window.DJUNTA existe");
        console.log("   ✅ window.DJUNTA existe");
        
        // TEST 2a: Vérifier le client Supabase
        if (window.DJUNTA.sb && typeof window.DJUNTA.sb.from === 'function') {
            results.success.push("✅ Client Supabase (DJUNTA.sb) initialisé");
            console.log("   ✅ window.DJUNTA.sb est initialisé correctement");
        } else {
            results.errors.push("❌ Client Supabase (DJUNTA.sb) NON initialisé");
            console.error("   ❌ window.DJUNTA.sb n'est pas initialisé");
            console.log("   💡 Ajoutez: <script src='djunta-master.js' defer></script>");
        }
    } else {
        results.errors.push("❌ Namespace window.DJUNTA n'existe pas");
        console.error("   ❌ window.DJUNTA n'existe pas");
        console.log("   💡 Assurez-vous que djunta-master.js est chargé");
    }

    // TEST 3: Vérifier la session utilisateur
    console.log("\n👤 Test 3: Vérification session utilisateur...");
    const authFlag = localStorage.getItem('djunta_auth');
    const userDataStr = localStorage.getItem('djunta_user');
    
    if (authFlag === 'true') {
        results.success.push("✅ Session utilisateur active (localStorage)");
        console.log("   ✅ djunta_auth = true");
        
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                console.log("   ✅ Données utilisateur:", {
                    id: userData.id || 'N/A',
                    email: userData.email || 'N/A'
                });
            } catch (e) {
                results.warnings.push("⚠️  Données utilisateur corrompues dans localStorage");
                console.warn("   ⚠️  Impossible de parser djunta_user");
            }
        } else {
            results.warnings.push("⚠️  Pas de données utilisateur dans localStorage");
            console.warn("   ⚠️  djunta_user est vide");
        }
    } else {
        results.warnings.push("ℹ️  Aucune session utilisateur active");
        console.log("   ℹ️  Utilisateur non connecté");
    }

    // TEST 4: Tester une requête simple sur la table vehicles (si client disponible)
    if (window.DJUNTA && window.DJUNTA.sb) {
        console.log("\n🚗 Test 4: Test de lecture table 'vehicles'...");
        try {
            const { data, error } = await window.DJUNTA.sb
                .from('vehicles')
                .select('id, brand, model')
                .limit(1);
            
            if (error) {
                results.errors.push("❌ Erreur lors de la lecture de la table 'vehicles'");
                console.error("   ❌ Erreur:", error.message);
                console.error("   Détails:", error);
            } else {
                results.success.push("✅ Lecture table 'vehicles' réussie");
                console.log("   ✅ Requête réussie");
                if (data && data.length > 0) {
                    console.log("   📊 Exemple de véhicule:", data[0]);
                } else {
                    console.log("   ℹ️  Aucun véhicule dans la base");
                }
            }
        } catch (err) {
            results.errors.push("❌ Exception lors du test de lecture");
            console.error("   ❌ Exception:", err.message);
        }
    } else {
        console.log("\n🚗 Test 4: IGNORÉ (client Supabase non disponible)");
    }

    // TEST 5: Vérifier la session Supabase côté serveur
    if (window.DJUNTA && window.DJUNTA.sb) {
        console.log("\n🔐 Test 5: Vérification session Supabase...");
        try {
            const { data: { session }, error } = await window.DJUNTA.sb.auth.getSession();
            
            if (error) {
                results.warnings.push("⚠️  Erreur lors de la vérification de session");
                console.warn("   ⚠️  Erreur:", error.message);
            } else if (session) {
                results.success.push("✅ Session Supabase active");
                console.log("   ✅ Session active:", {
                    user: session.user.email,
                    expires_at: new Date(session.expires_at * 1000).toLocaleString()
                });
            } else {
                results.warnings.push("ℹ️  Pas de session Supabase active");
                console.log("   ℹ️  Aucune session Supabase trouvée");
            }
        } catch (err) {
            results.errors.push("❌ Exception lors de la vérification de session");
            console.error("   ❌ Exception:", err.message);
        }
    } else {
        console.log("\n🔐 Test 5: IGNORÉ (client Supabase non disponible)");
    }

    // TEST 6: Vérifier DjuntaDB (si présent)
    console.log("\n💾 Test 6: Vérification service DjuntaDB...");
    if (typeof DjuntaDB !== 'undefined') {
        results.success.push("✅ Service DjuntaDB chargé");
        console.log("   ✅ DjuntaDB existe");
        
        const methods = ['getCars', 'getById', 'filterVehicles'];
        methods.forEach(method => {
            if (typeof DjuntaDB[method] === 'function') {
                console.log(`   ✅ DjuntaDB.${method}() disponible`);
            } else {
                results.warnings.push(`⚠️  DjuntaDB.${method}() manquant`);
                console.warn(`   ⚠️  DjuntaDB.${method}() n'existe pas`);
            }
        });
    } else {
        results.warnings.push("ℹ️  Service DjuntaDB non chargé sur cette page");
        console.log("   ℹ️  DjuntaDB n'est pas défini (normal si db-service.js n'est pas inclus)");
    }

    // RÉSUMÉ FINAL
    console.log("\n" + "=".repeat(50));
    console.log("📊 RÉSUMÉ DU DIAGNOSTIC");
    console.log("=".repeat(50));
    
    if (results.success.length > 0) {
        console.log("\n✅ SUCCÈS (" + results.success.length + "):");
        results.success.forEach(msg => console.log("   " + msg));
    }
    
    if (results.warnings.length > 0) {
        console.log("\n⚠️  AVERTISSEMENTS (" + results.warnings.length + "):");
        results.warnings.forEach(msg => console.log("   " + msg));
    }
    
    if (results.errors.length > 0) {
        console.log("\n❌ ERREURS (" + results.errors.length + "):");
        results.errors.forEach(msg => console.log("   " + msg));
    }
    
    if (results.errors.length === 0) {
        console.log("\n🎉 DIAGNOSTIC TERMINÉ : Aucune erreur critique détectée!");
    } else {
        console.log("\n⚠️  DIAGNOSTIC TERMINÉ : Des erreurs nécessitent votre attention.");
    }
    
    console.log("\n" + "=".repeat(50));
    
    return {
        success: results.success.length,
        warnings: results.warnings.length,
        errors: results.errors.length,
        details: results
    };
})();
