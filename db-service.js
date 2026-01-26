/**
 * SERVICE BASE DE DONNÉES (DAL)
 * Centralise toutes les requêtes vers Supabase.
 */

const DjuntaDB = {

    // A. AUTOMATISATION : Récupérer les voitures (Location seule)
    async getCars() {
        const { data, error } = await _supabase
            .from('vehicles')
            .select('*')
            .eq('is_driver_included', false) // Filtre SQL : Pas de chauffeur
            .eq('is_active', true)          // Uniquement les véhicules actifs
            .order('price_per_day', { ascending: true }); // Tri par prix

        if (error) { console.error("🚨 Erreur SQL getCars:", error); return []; }
        return data;
    },

    // B. AUTOMATISATION : Récupérer les chauffeurs (VTC)
    async getDrivers() {
        const { data, error } = await _supabase
            .from('vehicles')
            .select('*')
            .eq('is_driver_included', true) // Filtre SQL : Avec chauffeur
            .eq('is_active', true);

        if (error) { console.error("🚨 Erreur SQL getDrivers:", error); return []; }
        return data;
    },

    // C. AUTOMATISATION : Récupérer un détail (par ID)
    async getById(id) {
        const { data, error } = await _supabase
            .from('vehicles')
            .select('*, owner_id(*)') // Récupère aussi les infos du propriétaire lié
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    },

    // D. AUTOMATISATION : Filtrer (Recherche avancée)
    async filterVehicles(type, maxPrice) {
        let query = _supabase.from('vehicles').select('*');

        if (type && type !== 'all') {
            query = query.ilike('category', `%${type}%`);
        }
        if (maxPrice) {
            query = query.lte('price_per_day', maxPrice);
        }

        const { data, error } = await query;
        return data || [];
    }
};
