/**
 * SERVICE BASE DE DONNÉES (VERSION STABLE)
 * Uses unified Supabase client from djunta-master.js
 */

// Use global _supabase client (set by djunta-master.js)
const getSupabaseClient = () => {
    if (typeof _supabase !== 'undefined') {
        return _supabase;
    }
    if (window.DJUNTA && window.DJUNTA.sb) {
        return window.DJUNTA.sb;
    }
    console.error('Supabase client not initialized. Make sure djunta-master.js loads first.');
    return null;
};

const DjuntaDB = {

    // Récupérer toutes les voitures
    async getCars() {
        const client = getSupabaseClient();
        if (!client) return [];
        
        const { data, error } = await client
            .from('vehicles')
            .select('*')
            .eq('is_driver_included', false); 

        if (error) { console.error("Erreur getCars:", error); return []; }
        return data || [];
    },

    // Récupérer UN véhicule (VERSION FIXÉE)
    async getById(id) {
        const client = getSupabaseClient();
        if (!client) return null;
        
        // On ne demande PLUS les infos 'owner_id' pour éviter le bug
        const { data, error } = await client
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
