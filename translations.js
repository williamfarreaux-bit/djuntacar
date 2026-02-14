/**
 * DjuntaCar - Dictionnaire de Traductions
 * Dictionnaire centralisé pour toutes les pages
 * Support: FR (Français), PT (Português), EN (English)
 */

const translations = {
    fr: {
        // Navigation
        nav_home: 'Accueil',
        nav_rent: 'Louer un véhicule',
        nav_driver: 'Devenir chauffeur',
        nav_profile: 'Mon Profil',
        
        // Hero Section
        hero_title: 'Louer une voiture au Cap-Vert',
        hero_subtitle: 'Avec ou sans chauffeur',
        
        // Search
        search_island: "Choisir l'île",
        search_location: 'Lieu de prise en charge',
        search_btn: 'Rechercher',
        
        // Categories
        cat_title: 'Nos Catégories',
        
        // CTA Buttons
        cta_add: 'Inscrire ma voiture',
        cta_be_driver: 'Devenir chauffeur',
        cta_rent: 'Louer maintenant',
        
        // Login/Signup
        login_title: 'Connexion',
        login_email: 'Email',
        login_password: 'Mot de passe',
        login_btn: 'Se connecter',
        login_forgot: 'Mot de passe oublié ?',
        login_signup: "Pas de compte ? S'inscrire",
        
        signup_title: 'Inscription',
        signup_name: 'Nom complet',
        signup_email: 'Email',
        signup_password: 'Mot de passe',
        signup_btn: "S'inscrire",
        signup_login: 'Déjà inscrit ? Se connecter',
        
        // Profile
        profile_title: 'Mon Profil',
        profile_edit: 'Modifier le profil',
        profile_logout: 'Déconnexion',
        
        // Common
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        confirm: 'Confirmer',
        
        // Cars
        car_details: 'Détails du véhicule',
        car_price: 'Prix par jour',
        car_available: 'Disponible',
        car_book: 'Réserver',
        
        // Booking
        booking_title: 'Réservation',
        booking_date_start: 'Date de début',
        booking_date_end: 'Date de fin',
        booking_total: 'Total',
        booking_confirm: 'Confirmer la réservation'
    },
    
    pt: {
        // Navigation
        nav_home: 'Início',
        nav_rent: 'Alugar um veículo',
        nav_driver: 'Ser motorista',
        nav_profile: 'Meu Perfil',
        
        // Hero Section
        hero_title: 'Alugar um carro em Cabo Verde',
        hero_subtitle: 'Com ou sem motorista',
        
        // Search
        search_island: "Escolher a ilha",
        search_location: 'Local de recolha',
        search_btn: 'Pesquisar',
        
        // Categories
        cat_title: 'Nossas Categorias',
        
        // CTA Buttons
        cta_add: 'Inscrever meu carro',
        cta_be_driver: 'Tornar-se motorista',
        cta_rent: 'Alugar agora',
        
        // Login/Signup
        login_title: 'Entrar',
        login_email: 'Email',
        login_password: 'Senha',
        login_btn: 'Entrar',
        login_forgot: 'Esqueceu a senha?',
        login_signup: 'Não tem conta? Registre-se',
        
        signup_title: 'Registrar',
        signup_name: 'Nome completo',
        signup_email: 'Email',
        signup_password: 'Senha',
        signup_btn: 'Registrar',
        signup_login: 'Já tem conta? Entrar',
        
        // Profile
        profile_title: 'Meu Perfil',
        profile_edit: 'Editar perfil',
        profile_logout: 'Sair',
        
        // Common
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        save: 'Salvar',
        delete: 'Excluir',
        confirm: 'Confirmar',
        
        // Cars
        car_details: 'Detalhes do veículo',
        car_price: 'Preço por dia',
        car_available: 'Disponível',
        car_book: 'Reservar',
        
        // Booking
        booking_title: 'Reserva',
        booking_date_start: 'Data de início',
        booking_date_end: 'Data de término',
        booking_total: 'Total',
        booking_confirm: 'Confirmar reserva'
    },
    
    en: {
        // Navigation
        nav_home: 'Home',
        nav_rent: 'Rent a vehicle',
        nav_driver: 'Become a driver',
        nav_profile: 'My Profile',
        
        // Hero Section
        hero_title: 'Rent a car in Cape Verde',
        hero_subtitle: 'With or without driver',
        
        // Search
        search_island: "Choose island",
        search_location: 'Pick-up location',
        search_btn: 'Search',
        
        // Categories
        cat_title: 'Our Categories',
        
        // CTA Buttons
        cta_add: 'Register my car',
        cta_be_driver: 'Become a driver',
        cta_rent: 'Rent now',
        
        // Login/Signup
        login_title: 'Login',
        login_email: 'Email',
        login_password: 'Password',
        login_btn: 'Login',
        login_forgot: 'Forgot password?',
        login_signup: 'No account? Sign up',
        
        signup_title: 'Sign Up',
        signup_name: 'Full name',
        signup_email: 'Email',
        signup_password: 'Password',
        signup_btn: 'Sign Up',
        signup_login: 'Already registered? Login',
        
        // Profile
        profile_title: 'My Profile',
        profile_edit: 'Edit profile',
        profile_logout: 'Logout',
        
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        confirm: 'Confirm',
        
        // Cars
        car_details: 'Vehicle details',
        car_price: 'Price per day',
        car_available: 'Available',
        car_book: 'Book',
        
        // Booking
        booking_title: 'Booking',
        booking_date_start: 'Start date',
        booking_date_end: 'End date',
        booking_total: 'Total',
        booking_confirm: 'Confirm booking'
    }
};

// Export pour compatibilité avec différents environnements
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
