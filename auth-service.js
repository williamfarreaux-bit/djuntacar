/**
 * SERVICE D'AUTHENTIFICATION
 * Gère l'inscription, la connexion et la déconnexion.
 */

const DjuntaAuth = {
    
    // 1. Inscription
    async signUp(email, password, firstName, lastName) {
        // A. Créer le compte technique (Auth)
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) return { success: false, message: error.message };

        // B. Créer le profil public (Table 'profiles')
        if (data.user) {
            const { error: profileError } = await _supabase
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        first_name: firstName, 
                        last_name: lastName,
                        email: email
                    }
                ]);
            
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

    // 3. Déconnexion
    async signOut() {
        await _supabase.auth.signOut();
        window.location.href = 'index.html';
    },

    // 4. Vérifier si connecté
    async getUser() {
        const { data } = await _supabase.auth.getUser();
        return data.user;
    }
};
