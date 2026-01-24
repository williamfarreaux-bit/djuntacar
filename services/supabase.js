import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// VOS CLÉS (Celles que j'ai récupérées de l'historique)
const SUPABASE_URL = 'https://enuiuuwnjzvpfvpklmjw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-';

// Création du client unique
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fonction utilitaire pour récupérer l'utilisateur connecté
export async function getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error('Erreur Session:', error);
    return session?.user || null;
}
