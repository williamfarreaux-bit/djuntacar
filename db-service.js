/**
 * SERVICE BASE DE DONNÉES (VERSION STABLE)
 */
const DjuntaDB = {

    // Récupérer toutes les voitures
    async getCars() {
        if (!window.DJUNTA || !window.DJUNTA.sb) {
            console.error("DjuntaDB: Client Supabase non initialisé");
            return [];
        }
        
        const { data, error } = await window.DJUNTA.sb
            .from('vehicles')
            .select('*')
            .eq('is_driver_included', false); 

        if (error) { console.error("Erreur getCars:", error); return []; }
        return data || [];
    },

    // Récupérer UN véhicule (VERSION FIXÉE)
    async getById(id) {
        if (!window.DJUNTA || !window.DJUNTA.sb) {
            console.error("DjuntaDB: Client Supabase non initialisé");
            return null;
        }
        
        // On ne demande PLUS les infos 'owner_id' pour éviter le bug
        const { data, error } = await window.DJUNTA.sb
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
    async filterVehicles(type) { /* ... peut rester vide pour l'instant ... */ }
};
