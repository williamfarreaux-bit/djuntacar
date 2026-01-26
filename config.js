/**
 * CONFIGURATION SUPABASE
 */

// 1. Collez l'URL ici (gardez les guillemets "")
const SUPABASE_URL = "https://enuiuuwnjzvpfvpklmjw.supabase.co"; 

// 2. Collez la clé 'anon public' ici (gardez les guillemets "")
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudWl1dXduanp2cGZ2cGtsbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjIwMzMsImV4cCI6MjA4NDczODAzM30.Ry4beH9ki0sql51XWo5eA1iRluFokVKClaDnbuUGxGA"; 

// Ne touchez pas à la suite
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ Config chargée");
