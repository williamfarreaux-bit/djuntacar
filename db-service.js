/**
 * SERVICE BASE DE DONNÉES (VERSION STABLE)
 */
const DjuntaDB = {

    // Récupérer toutes les voitures
    async getCars() {
        try {
            const { data, error } = await _supabase
                .from('vehicles')
                .select('*')
                .eq('is_driver_included', false); 

            if (error) { 
                console.error("Erreur getCars:", error); 
                return []; 
            }
            return data || [];
        } catch (err) {
            console.error("Erreur getCars (exception):", err);
            return [];
        }
    },

    // Récupérer UN véhicule (VERSION FIXÉE)
    async getById(id) {
        try {
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
        } catch (err) {
            console.error("Erreur getById (exception):", err);
            return null;
        }
    },

    // Recherche
    async filterVehicles(type) { 
        /* ... peut rester vide pour l'instant ... */ 
    }
};
