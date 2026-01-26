/**
 * CONFIGURATION SUPABASE
 * Remplacez les valeurs ci-dessous par celles de votre projet Supabase
 * (Settings > API)
 */

const SUPABASE_URL = "VOTRE_URL_SUPABASE_ICI"; // ex: https://xyz.supabase.co
const SUPABASE_ANON_KEY = "VOTRE_CLE_ANON_ICI"; // ex: eyJhbGciOiJIUzI1NiIsInR...

// Initialisation du client Supabase (nécessite le script CDN dans le HTML)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ DjuntaCar Config Loaded");
