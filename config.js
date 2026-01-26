/**
 * CONFIGURATION SUPABASE
 * Remplacez les valeurs ci-dessous par celles de votre projet Supabase
 * (Settings > API)
 */

const SUPABASE_URL = "https://enuiuuwnjzvpfvpklmjw.supabase.co"; // 
const SUPABASE_ANON_KEY = "'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudWl1dXduanp2cGZ2cGtsbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjIwMzMsImV4cCI6MjA4NDczODAzM30.Ry4beH9ki0sql51XWo5eA1iRluFokVKClaDnbuUGxGA"; // 
// Initialisation du client Supabase (nécessite le script CDN dans le HTML)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ DjuntaCar Config Loaded");
