/**
 * SERVICE D'AUTHENTIFICATION (Version Corrigée)
 * Gère Inscription, Connexion, Déconnexion ET Mot de passe oublié
 */

// Initialisation de l'instance Supabase pour le service
// On utilise les clés présentes dans config.js
const _supabase = window.supabase.createClient(DJUNTA_CONFIG.supabase.url, DJUNTA_CONFIG.supabase.anonKey);

const DjuntaAuth = {
    
    // 1. Inscription (Avec création de profil)
    async signUp(email, password, firstName, lastName) {
        try {
            const { data, error } = await _supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // Redirection après le clic dans l'email de validation
                    emailRedirectTo: window.location.origin + '/index.html'
                }
            });

            if (error) return { success: false, message: error.message };

            // Si l'utilisateur est créé (ou existe déjà mais n'est pas confirmé)
            if (data.user) {
                // Création ou mise à jour du profil public dans la table 'profiles'
                const { error: profileError } = await _supabase
                    .from('profiles')
                    .upsert([{ 
                        id: data.user.id, 
                        first_name: firstName, 
                        last_name: lastName,
                        email: email
                    }]);
                
                if (profileError) {
                    console.error("Erreur Profil:", profileError.message);
                }
            }

            return { success: true, user: data.user };
        } catch (err) {
            console.error("Erreur critique Signup:", err);
            return { success: false, message: "Une erreur technique est survenue." };
        }
    },

    // 2. Connexion
    async signIn(email, password) {
        try {
            const { data, error } = await _supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) return { success: false, message: "Email ou mot de passe incorrect." };
            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, message: "Erreur de connexion au serveur." };
        }
    },

    // 3. Demander la réinitialisation par email
    async resetPassword(email) {
        try {
            const { error } = await _supabase.auth.resetPasswordForEmail(email, {
                // Doit correspondre au nom de ton fichier de confirmation
                redirectTo: window.location.origin + '/reset-password-confirm.html',
            });
            
            if (error) return { success: false, message: error.message };
            return { success: true };
        } catch (err) {
            return { success: false, message: "Impossible d'envoyer le lien." };
        }
    },

    // 4. Mettre à jour le mot de passe (Après clic lien email)
    async updatePassword(newPassword) {
        try {
            const { error } = await _supabase.auth.updateUser({ password: newPassword });
            if (error) return { success: false, message: error.message };
            return { success: true };
        } catch (err) {
            return { success: false, message: "Erreur lors de la mise à jour." };
        }
    },

    // 5. Déconnexion
    async signOut() {
        await _supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    // 6. Vérifier si l'utilisateur est connecté
    async getUser() {
        try {
            const { data: { user } } = await _supabase.auth.getUser();
            return user;
        } catch (err) {
            return null;
        }
    }
};
