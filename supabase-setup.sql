-- ============================================
-- DJUNTACAR - COMPLETE SUPABASE SQL SETUP
-- ============================================
-- This script sets up the complete database schema for DjuntaCar
-- Run this in the Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CLEAN START - DROP ALL TABLES AND TRIGGERS
-- ============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES IN CORRECT ORDER
-- ============================================

-- PROFILES TABLE (Base table - must be created first)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    selfie_url TEXT,
    id_card_url TEXT,
    id_card_number TEXT,
    driver_license_url TEXT,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'host', 'driver', 'admin')),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VEHICLES TABLE
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT DEFAULT '4x4' CHECK (category IN ('4x4', 'citadine', 'luxe', 'utilitaire')),
    price_per_day INTEGER NOT NULL,
    location TEXT,
    image_url TEXT,
    license_plate TEXT,
    transmission TEXT DEFAULT 'Manuelle' CHECK (transmission IN ('Manuelle', 'Automatique')),
    fuel_type TEXT DEFAULT 'Essence' CHECK (fuel_type IN ('Essence', 'Diesel', 'Électrique', 'Hybride')),
    has_air_conditioning BOOLEAN DEFAULT false,
    is_driver_included BOOLEAN DEFAULT false,
    seats INTEGER DEFAULT 5,
    year INTEGER,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAVORITES TABLE
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- REVIEWS TABLE
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES TABLE
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSPECTIONS TABLE
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('check-in', 'check-out')),
    odometer INTEGER,
    fuel_level TEXT,
    notes TEXT,
    photos JSONB,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SIGNATURES TABLE (for rental contracts)
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    signer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    signature_url TEXT NOT NULL,
    signature_type TEXT CHECK (signature_type IN ('renter', 'owner')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_available ON vehicles(is_available);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_vehicle ON favorites(vehicle_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_inspections_booking ON inspections(booking_id);
CREATE INDEX idx_signatures_booking ON signatures(booking_id);

-- ============================================
-- STEP 4: AUTO-CREATE PROFILE TRIGGER
-- ============================================

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Everyone can read all profiles (for displaying user info)
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation if needed)
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- VEHICLES POLICIES
-- Public read access for everyone
CREATE POLICY "Vehicles are viewable by everyone"
    ON vehicles FOR SELECT
    USING (true);

-- Only owners can insert their vehicles
CREATE POLICY "Owners can insert vehicles"
    ON vehicles FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Only owners can update their vehicles
CREATE POLICY "Owners can update own vehicles"
    ON vehicles FOR UPDATE
    USING (auth.uid() = owner_id);

-- Only owners can delete their vehicles
CREATE POLICY "Owners can delete own vehicles"
    ON vehicles FOR DELETE
    USING (auth.uid() = owner_id);

-- BOOKINGS POLICIES
-- Only the renter and the vehicle owner can see specific bookings
CREATE POLICY "Renters and owners can view their bookings"
    ON bookings FOR SELECT
    USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT owner_id FROM vehicles WHERE id = bookings.vehicle_id
        )
    );

-- Only authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only the renter can update their booking
CREATE POLICY "Renters can update their bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Only the renter can delete their booking
CREATE POLICY "Renters can delete their bookings"
    ON bookings FOR DELETE
    USING (auth.uid() = user_id);

-- FAVORITES POLICIES
-- Users can only see their own favorites
CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can insert own favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can remove their favorites
CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- REVIEWS POLICIES
-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

-- Only the reviewer can insert their review
CREATE POLICY "Reviewers can insert own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- Only the reviewer can update their review
CREATE POLICY "Reviewers can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = reviewer_id);

-- MESSAGES POLICIES
-- Users can see messages they sent or received
CREATE POLICY "Users can view own messages"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id OR
        auth.uid() IN (
            SELECT user_id FROM bookings WHERE id = messages.booking_id
            UNION
            SELECT owner_id FROM vehicles WHERE id IN (
                SELECT vehicle_id FROM bookings WHERE id = messages.booking_id
            )
        )
    );

-- Users can send messages
CREATE POLICY "Users can insert messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- INSPECTIONS POLICIES
-- Only renter and owner can view inspections for their bookings
CREATE POLICY "Booking participants can view inspections"
    ON inspections FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM bookings WHERE id = inspections.booking_id
            UNION
            SELECT owner_id FROM vehicles WHERE id IN (
                SELECT vehicle_id FROM bookings WHERE id = inspections.booking_id
            )
        )
    );

-- Authenticated users can insert inspections
CREATE POLICY "Authenticated users can insert inspections"
    ON inspections FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM bookings WHERE id = booking_id
            UNION
            SELECT owner_id FROM vehicles WHERE id IN (
                SELECT vehicle_id FROM bookings WHERE id = booking_id
            )
        )
    );

-- SIGNATURES POLICIES
-- Only booking participants can view signatures
CREATE POLICY "Booking participants can view signatures"
    ON signatures FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM bookings WHERE id = signatures.booking_id
            UNION
            SELECT owner_id FROM vehicles WHERE id IN (
                SELECT vehicle_id FROM bookings WHERE id = signatures.booking_id
            )
        )
    );

-- Only the signer can insert their signature
CREATE POLICY "Signers can insert own signature"
    ON signatures FOR INSERT
    WITH CHECK (auth.uid() = signer_id);

-- ============================================
-- STEP 6: SET ADMIN ROLE FOR william.farreaux@gmail.com
-- ============================================

-- Update the role to 'admin' for the specified user
UPDATE profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'william.farreaux@gmail.com';

-- If the profile doesn't exist yet (user hasn't signed up), this will set it once they do
-- You can also create the profile manually if needed:
-- INSERT INTO profiles (id, email, role, created_at, updated_at)
-- SELECT id, email, 'admin', NOW(), NOW()
-- FROM auth.users
-- WHERE email = 'william.farreaux@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();

-- ============================================
-- STEP 7: STORAGE BUCKET SETUP INSTRUCTIONS
-- ============================================

-- IMPORTANT: Storage buckets cannot be created via SQL in Supabase.
-- You must create the following buckets manually in the Supabase Dashboard:
-- 
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Create the following buckets:
--    
--    a) Bucket name: "identity-docs"
--       - Access: Private (not public)
--       - Purpose: Store user identity documents (selfies, ID cards, driver licenses)
--       - File size limit: 10MB recommended
--       - Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf
--
--    b) Bucket name: "vehicles"
--       - Access: Public
--       - Purpose: Store vehicle photos
--       - File size limit: 5MB recommended
--       - Allowed MIME types: image/jpeg, image/png, image/webp
--
--    c) Bucket name: "signatures"
--       - Access: Public
--       - Purpose: Store rental contract signatures
--       - File size limit: 2MB recommended
--       - Allowed MIME types: image/png, image/jpeg
--
--    d) Bucket name: "inspections"
--       - Access: Private
--       - Purpose: Store vehicle inspection photos
--       - File size limit: 5MB recommended
--       - Allowed MIME types: image/jpeg, image/png, image/webp
--
-- 3. Set up RLS policies for each bucket:
--
--    For "identity-docs" bucket:
--    - Users can upload to their own folder: bucket_id = 'identity-docs' AND (storage.foldername(name))[1] = auth.uid()
--    - Users can view their own files: bucket_id = 'identity-docs' AND (storage.foldername(name))[1] = auth.uid()
--
--    For "vehicles" bucket:
--    - Public read access (already public)
--    - Authenticated users can upload: bucket_id = 'vehicles' AND auth.role() = 'authenticated'
--
--    For "signatures" bucket:
--    - Public read access (already public)
--    - Authenticated users can upload: bucket_id = 'signatures' AND auth.role() = 'authenticated'
--
--    For "inspections" bucket:
--    - Booking participants can view: Complex policy based on booking relationship
--    - Booking participants can upload: Complex policy based on booking relationship

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Your DjuntaCar database is now ready!
-- 
-- Next steps:
-- 1. Create the storage buckets as described above
-- 2. Test user registration to ensure profiles are auto-created
-- 3. Verify that william.farreaux@gmail.com has admin role
-- 4. Test RLS policies by creating data with different users
-- 
-- Happy coding! 🚗
