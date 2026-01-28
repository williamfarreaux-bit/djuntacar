/**
 * SERVICE D'AUTHENTIFICATION (Version Complète)
 * Gère Inscription, Connexion, Déconnexion ET Mot de passe oublié
 */

const DjuntaAuth = {
    
    // 1. Inscription (Avec redirection pour validation email)
    async signUp(email, password, firstName, lastName) {
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // IMPORTANT : Redirection après le clic dans l'email de validation
                emailRedirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) return { success: false, message: error.message };

        // Création du profil public
        if (data.user) {
            const { error: profileError } = await _supabase
                .from('profiles')
                .insert([{ 
                    id: data.user.id, 
                    first_name: firstName, 
                    last_name: lastName,
                    email: email
                }]);
            
            if (profileError) console.error("Erreur Profil:", profileError);
        }

        return { success: true, user: data.user };
    },

    // 2. Connexion
    async signIn(email, password) {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) return { success: false, message: "Email ou mot de passe incorrect." };
        return { success: true, user: data.user };
    },

    // 3. (NOUVEAU) Demander la réinitialisation par email
    async resetPassword(email) {
        const { error } = await _supabase.auth.resetPasswordForEmail(email, {
            // Redirige vers la page de changement de mot de passe
            redirectTo: window.location.origin + '/update-password.html',
        });
        
        if (error) return { success: false, message: error.message };
        return { success: true };
    },

    // 4. (NOUVEAU) Mettre à jour le mot de passe (Après clic lien email)
    async updatePassword(newPassword) {
        const { error } = await _supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, message: error.message };
        return { success: true };
    },

    // 5. Déconnexion
    async signOut() {
        await _supabase.auth.signOut();
        window.location.href = 'login.html'; // Mieux vaut rediriger vers le login
    },

    // 6. Vérifier si connecté
    async getUser() {
        const { data } = await _supabase.auth.getUser();
        return data.user;
    }
};
