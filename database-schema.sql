-- ========================================
-- DJUNTACAR - COMPLETE DATABASE SCHEMA
-- Clean Slate & Recreation Script
-- ========================================

-- ========================================
-- STEP 1: CLEAN SLATE - DROP EVERYTHING
-- ========================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop storage buckets if they exist
-- Note: This must be done through Supabase Dashboard or API
-- DELETE FROM storage.buckets WHERE id IN ('vehicles', 'identity-docs');

-- ========================================
-- STEP 2: CREATE TABLES
-- ========================================

-- -----------------------
-- PROFILES TABLE
-- Linked to Supabase Auth (auth.users)
-- -----------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    selfie_url TEXT,
    id_card_url TEXT,
    driver_license_url TEXT,
    driver_license_number TEXT,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'host', 'driver', 'admin')),
    balance DECIMAL(10, 2) DEFAULT 0.00,
    is_driver BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------
-- VEHICLES TABLE
-- Vehicle listings with full specifications
-- -----------------------
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('4x4', 'citadine', 'luxe', 'utilitaire')),
    price_per_day INTEGER NOT NULL,
    year INTEGER,
    location TEXT NOT NULL,
    image_url TEXT,
    transmission TEXT DEFAULT 'Manuelle' CHECK (transmission IN ('Manuelle', 'Automatique')),
    fuel_type TEXT DEFAULT 'Essence' CHECK (fuel_type IN ('Essence', 'Diesel', 'Électrique', 'Hybride')),
    has_air_conditioning BOOLEAN DEFAULT FALSE,
    seats INTEGER DEFAULT 5,
    is_driver_included BOOLEAN DEFAULT FALSE,
    license_plate TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------
-- BOOKINGS TABLE
-- Rental bookings with dates and status
-- -----------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------
-- FAVORITES TABLE
-- User favorite vehicles
-- -----------------------
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- -----------------------
-- REVIEWS TABLE
-- User reviews and ratings
-- -----------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_id)
);

-- -----------------------
-- MESSAGES TABLE
-- Chat messages between users (linked to bookings)
-- -----------------------
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------
-- INSPECTIONS TABLE
-- Vehicle inspection records (check-in and return)
-- -----------------------
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('check-in', 'return')),
    odometer_reading INTEGER,
    fuel_level INTEGER CHECK (fuel_level >= 0 AND fuel_level <= 100),
    photo_front_url TEXT,
    photo_back_url TEXT,
    photo_left_url TEXT,
    photo_right_url TEXT,
    notes TEXT,
    inspector_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------
-- SIGNATURES TABLE
-- Digital signatures for rental contracts
-- -----------------------
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    signer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    signature_data_url TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, signer_id)
);

-- ========================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_location ON vehicles(location);
CREATE INDEX idx_vehicles_available ON vehicles(is_available);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

-- ========================================
-- STEP 4: ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES POLICIES
-- ========================================

-- Users can view all profiles (for public info like names)
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ========================================
-- VEHICLES POLICIES
-- ========================================

-- Everyone can view available vehicles
CREATE POLICY "Vehicles are viewable by everyone"
ON vehicles FOR SELECT
USING (true);

-- Only authenticated users can insert vehicles
CREATE POLICY "Authenticated users can insert vehicles"
ON vehicles FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Vehicle owners can update their own vehicles
CREATE POLICY "Owners can update their vehicles"
ON vehicles FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Vehicle owners can delete their own vehicles
CREATE POLICY "Owners can delete their vehicles"
ON vehicles FOR DELETE
USING (auth.uid() = owner_id);

-- ========================================
-- BOOKINGS POLICIES
-- ========================================

-- Users can view their own bookings (as renter)
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (
    auth.uid() = user_id 
    OR 
    auth.uid() IN (
        SELECT owner_id FROM vehicles WHERE id = bookings.vehicle_id
    )
);

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings, or vehicle owners can update status
CREATE POLICY "Users and owners can update bookings"
ON bookings FOR UPDATE
USING (
    auth.uid() = user_id 
    OR 
    auth.uid() IN (
        SELECT owner_id FROM vehicles WHERE id = bookings.vehicle_id
    )
);

-- ========================================
-- FAVORITES POLICIES
-- ========================================

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove their favorites
CREATE POLICY "Users can delete their favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- REVIEWS POLICIES
-- ========================================

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

-- Users can create reviews for their bookings
CREATE POLICY "Users can create reviews for their bookings"
ON reviews FOR INSERT
WITH CHECK (
    auth.uid() = reviewer_id 
    AND 
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = reviews.booking_id 
        AND bookings.user_id = auth.uid()
    )
);

-- ========================================
-- MESSAGES POLICIES
-- ========================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
ON messages FOR UPDATE
USING (auth.uid() = receiver_id);

-- ========================================
-- INSPECTIONS POLICIES
-- ========================================

-- Users involved in a booking can view inspections
CREATE POLICY "Booking participants can view inspections"
ON inspections FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = inspections.booking_id 
        AND (
            bookings.user_id = auth.uid() 
            OR 
            bookings.vehicle_id IN (
                SELECT id FROM vehicles WHERE owner_id = auth.uid()
            )
        )
    )
);

-- Users can create inspections for their bookings
CREATE POLICY "Users can create inspections"
ON inspections FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = inspections.booking_id 
        AND (
            bookings.user_id = auth.uid() 
            OR 
            bookings.vehicle_id IN (
                SELECT id FROM vehicles WHERE owner_id = auth.uid()
            )
        )
    )
);

-- ========================================
-- SIGNATURES POLICIES
-- ========================================

-- Users involved in a booking can view signatures
CREATE POLICY "Booking participants can view signatures"
ON signatures FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = signatures.booking_id 
        AND (
            bookings.user_id = auth.uid() 
            OR 
            bookings.vehicle_id IN (
                SELECT id FROM vehicles WHERE owner_id = auth.uid()
            )
        )
    )
);

-- Users can create their own signatures
CREATE POLICY "Users can create their signatures"
ON signatures FOR INSERT
WITH CHECK (auth.uid() = signer_id);

-- ========================================
-- STEP 5: TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- STEP 6: ADMIN SETUP
-- ========================================

-- Function to set admin role
CREATE OR REPLACE FUNCTION set_admin_user(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET role = 'admin', verification_status = 'verified'
    WHERE id = (SELECT id FROM auth.users WHERE email = user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set william.farreaux@gmail.com as admin
-- This will be executed after user signs up
-- Call this function after the user account is created:
-- SELECT set_admin_user('william.farreaux@gmail.com');

-- ========================================
-- STEP 7: STORAGE BUCKETS SETUP
-- ========================================

-- Note: Storage buckets need to be created via Supabase Dashboard or API
-- Required buckets:
-- 1. 'vehicles' - for vehicle images (public)
-- 2. 'identity-docs' - for identity verification documents (private with RLS)

-- To create buckets, use the Supabase Dashboard or run:
/*
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('vehicles', 'vehicles', true),
    ('identity-docs', 'identity-docs', false);
*/

-- Storage policies for 'vehicles' bucket
CREATE POLICY "Public can view vehicle images"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicles');

CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'vehicles' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for 'identity-docs' bucket
CREATE POLICY "Users can view their own identity docs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'identity-docs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own identity docs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'identity-docs' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ========================================
-- STEP 8: HELPER FUNCTIONS
-- ========================================

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- STEP 9: SAMPLE DATA (Optional)
-- ========================================

-- Uncomment to insert sample data for testing

/*
-- Sample profile (must have corresponding auth.users entry)
INSERT INTO profiles (id, first_name, last_name, phone, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'Test', 'User', '+238999999999', 'host');

-- Sample vehicle
INSERT INTO vehicles (owner_id, brand, model, category, price_per_day, location, transmission, fuel_type, seats)
VALUES ('11111111-1111-1111-1111-111111111111', 'Toyota', 'Hilux', '4x4', 8000, 'Santiago', 'Manuelle', 'Diesel', 5);
*/

-- ========================================
-- SCRIPT COMPLETE
-- ========================================

-- To set admin after william.farreaux@gmail.com signs up:
-- SELECT set_admin_user('william.farreaux@gmail.com');

-- Verify tables created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
