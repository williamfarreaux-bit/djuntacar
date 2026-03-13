/**
 * SERVICE BASE DE DONNÉES (VERSION STABLE)
 */
const DjuntaDB = {

    // Récupérer toutes les voitures
    async getCars() {
        const { data, error } = await _supabase
            .from('vehicles')
            .select('*')
            .eq('is_driver_included', false); 

        if (error) { console.error("Erreur getCars:", error); return []; }
        return data || [];
    },

    // Récupérer UN véhicule (VERSION FIXÉE)
    async getById(id) {
        // On ne demande PLUS les infos 'owner_id' pour éviter le bug
        const { data, error } = await _supabase
            .from('vehicles')
            .select('*') 
            .eq('id', id)
            .single();

        if (error) {
            console.error("Erreur getById:", error);
            return null;
        }
        return data;
    },

    // Recherche
    async filterVehicles(type) { /* ... peut rester vide pour l'instant ... */ },

    /**
     * Sign up a new user with proper metadata
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} fullName - User full name
     * @returns {Promise<{data, error}>}
     */
    async signUp(email, password, fullName) {
        if (!_supabase) {
            throw new Error('Supabase client not initialized');
        }

        // Split full name into first and last name
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        console.log('🔐 DjuntaDB.signUp called with:', { email, fullName, firstName, lastName });

        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    first_name: firstName,
                    last_name: lastName
                },
                emailRedirectTo: window.location.origin + '/login.html'
            }
        });

        if (error) {
            console.error('❌ Signup error:', error);
            return { data: null, error };
        }

        console.log('✅ Signup successful:', data);
        return { data, error: null };
    }
};
