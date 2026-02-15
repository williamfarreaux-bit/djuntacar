# DjuntaCar Supabase Setup Guide

This guide will help you set up the complete database schema for DjuntaCar using Supabase.

## 📋 Prerequisites

- A Supabase project created
- Access to the Supabase Dashboard
- Basic understanding of SQL

## 🚀 Quick Start

### Step 1: Run the SQL Script

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-setup.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

The script will:
- ✅ Drop all existing tables and triggers (clean slate)
- ✅ Create 8 tables in the correct order
- ✅ Set up foreign key relationships
- ✅ Create performance indexes
- ✅ Set up automatic profile creation for new users
- ✅ Assign admin role to william.farreaux@gmail.com
- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Create 24 security policies

### Step 2: Create Storage Buckets

Since storage buckets cannot be created via SQL, you need to create them manually:

1. Go to **Storage** in your Supabase Dashboard
2. Create the following buckets:

#### a) identity-docs (Private)
- **Access**: Private
- **Purpose**: User identity documents
- **File size limit**: 10MB
- **Allowed types**: image/jpeg, image/png, image/webp, application/pdf

#### b) vehicles (Public)
- **Access**: Public
- **Purpose**: Vehicle photos
- **File size limit**: 5MB
- **Allowed types**: image/jpeg, image/png, image/webp

#### c) signatures (Public)
- **Access**: Public
- **Purpose**: Rental contract signatures
- **File size limit**: 2MB
- **Allowed types**: image/png, image/jpeg

#### d) inspections (Private)
- **Access**: Private
- **Purpose**: Vehicle inspection photos
- **File size limit**: 5MB
- **Allowed types**: image/jpeg, image/png, image/webp

### Step 3: Verify the Setup

1. **Test User Registration**:
   - Sign up a new user
   - Check that a profile is automatically created in the `profiles` table

2. **Verify Admin Role**:
   - Log in with william.farreaux@gmail.com
   - Check that the role is set to 'admin' in the `profiles` table

3. **Test RLS Policies**:
   - Try to create a vehicle as an authenticated user
   - Try to view bookings with different users
   - Confirm that users can only see their own data

## 📊 Database Schema Overview

### Tables Created

1. **profiles** - User profile information
2. **vehicles** - Vehicle listings
3. **bookings** - Rental bookings
4. **favorites** - User favorite vehicles
5. **reviews** - Booking reviews and ratings
6. **messages** - Chat messages between users
7. **inspections** - Vehicle inspection records
8. **signatures** - Rental contract signatures

### Key Features

- **Automatic Profile Creation**: Profiles are automatically created when users sign up via Supabase Auth
- **Row Level Security**: All tables have RLS enabled with appropriate policies
- **Foreign Key Constraints**: Maintains data integrity across tables
- **Indexed Fields**: Optimized for common queries

## 🔐 Security Policies Summary

### Profiles
- ✅ Everyone can read all profiles
- ✅ Users can only update their own profile

### Vehicles
- ✅ Public read access for everyone
- ✅ Only owners can insert/update/delete their vehicles

### Bookings
- ✅ Only the renter and vehicle owner can view their bookings
- ✅ Only authenticated users can create bookings
- ✅ Only the renter can update/delete their booking

### Other Tables
- Similar policies ensuring users can only access their own data
- Special policies for related entities (e.g., booking participants can view associated data)

## 🛠️ Troubleshooting

### Issue: Profile not created automatically
- **Solution**: Check that the trigger `on_auth_user_created` exists and is enabled
- **Check**: Run `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`

### Issue: Admin role not assigned
- **Solution**: Manually run the UPDATE command after the user has signed up:
  ```sql
  UPDATE profiles
  SET role = 'admin', updated_at = NOW()
  WHERE email = 'william.farreaux@gmail.com';
  ```

### Issue: RLS policy errors
- **Solution**: Ensure RLS is enabled on all tables
- **Check**: Run `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

## 📝 Next Steps

After completing the setup:

1. Configure your Supabase client in your application
2. Test user registration and authentication
3. Test creating vehicles, bookings, and other entities
4. Configure email templates for authentication
5. Set up custom domain (optional)

## 💡 Tips

- Always test RLS policies with different user accounts
- Monitor the Supabase logs for any errors
- Keep your Supabase API keys secure
- Regularly backup your database

## 📞 Support

If you encounter any issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review the SQL script comments for detailed explanations
3. Check the browser console for error messages

---

**Note**: This setup is designed for the DjuntaCar application. Modify as needed for your specific requirements.
