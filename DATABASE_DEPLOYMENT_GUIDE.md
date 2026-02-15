# 🗄️ Database Schema Deployment Guide

## Quick Start

### Step 1: Clean Slate Deployment

1. Open **Supabase Dashboard** → SQL Editor
2. Copy the entire content of `database-schema.sql`
3. Paste into SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. ✅ Database will be dropped and recreated

### Step 2: Set Admin User

After william.farreaux@gmail.com signs up, run:

```sql
SELECT set_admin_user('william.farreaux@gmail.com');
```

### Step 3: Create Storage Buckets

Go to **Storage** section in Supabase Dashboard:

1. **Create bucket: `vehicles`**
   - Name: `vehicles`
   - Public: ✅ Yes
   - Purpose: Store vehicle images

2. **Create bucket: `identity-docs`**
   - Name: `identity-docs`
   - Public: ❌ No
   - Purpose: Store identity verification documents

The RLS policies for storage are already included in the SQL script.

---

## 📊 Database Structure

### Tables Created (8 total)

1. **profiles** - User profiles
2. **vehicles** - Vehicle listings
3. **bookings** - Rental bookings
4. **favorites** - User favorites
5. **reviews** - Ratings & reviews
6. **messages** - Chat messages
7. **inspections** - Vehicle inspections
8. **signatures** - Contract signatures

### Key Features

✅ **Row Level Security** enabled on all tables
✅ **Automatic timestamps** (created_at, updated_at)
✅ **Foreign key cascades** properly configured
✅ **Indexes** on frequently queried fields
✅ **Validation constraints** (ratings 1-5, status enums, etc.)
✅ **Auto-profile creation** on user signup

---

## 🔐 Security Model

### Role System

- **user** - Default role (can rent vehicles)
- **host** - Can list vehicles for rent
- **driver** - Can be hired with vehicles
- **admin** - Full access (william.farreaux@gmail.com)

### RLS Policies Summary

| Table | Public Read | User Create | User Update Own | Owner Access |
|-------|-------------|-------------|-----------------|--------------|
| profiles | ✅ | ✅ | ✅ | N/A |
| vehicles | ✅ | ✅ | ✅ | ✅ |
| bookings | ❌* | ✅ | ✅ | ✅ |
| favorites | ❌ | ✅ | ✅ | N/A |
| reviews | ✅ | ✅* | ❌ | N/A |
| messages | ❌* | ✅ | ✅* | N/A |
| inspections | ❌* | ✅* | ❌ | ✅ |
| signatures | ❌* | ✅ | ❌ | ✅ |

*Restricted to involved parties (booking participants)

---

## 📋 Verification Checklist

After running the script, verify:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected output:
-- bookings
-- favorites
-- inspections
-- messages
-- profiles
-- reviews
-- signatures
-- vehicles
```

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All should show: rowsecurity = true
```

```sql
-- Check storage buckets
SELECT * FROM storage.buckets;

-- Should show:
-- vehicles (public: true)
-- identity-docs (public: false)
```

---

## 🔧 Common Operations

### Make a user an admin
```sql
SELECT set_admin_user('email@example.com');
```

### Check user role
```sql
SELECT id, email, role 
FROM profiles 
JOIN auth.users ON profiles.id = auth.users.id 
WHERE email = 'email@example.com';
```

### View all bookings with details
```sql
SELECT 
    b.id,
    b.status,
    b.start_date,
    b.end_date,
    v.brand || ' ' || v.model as vehicle,
    p.first_name || ' ' || p.last_name as renter
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
JOIN profiles p ON b.user_id = p.id
ORDER BY b.created_at DESC;
```

### Check vehicle availability
```sql
SELECT 
    id,
    brand || ' ' || model as vehicle,
    location,
    price_per_day,
    is_available
FROM vehicles
WHERE is_available = true;
```

---

## 🚨 Troubleshooting

### Issue: "relation does not exist"
**Solution**: Storage policies fail if buckets don't exist. Create buckets first, then run policies section separately.

### Issue: "permission denied for schema auth"
**Solution**: Normal - auth schema is managed by Supabase. The trigger will work automatically.

### Issue: Admin function doesn't work
**Solution**: User must sign up first. Profile is auto-created on signup, then run the admin function.

### Issue: RLS blocks everything
**Solution**: Check if user is authenticated. Supabase uses `auth.uid()` which returns NULL for anonymous users.

---

## 📈 Performance Tips

### Indexes Already Created:
- vehicles(owner_id)
- vehicles(location)
- bookings(user_id, vehicle_id, status)
- favorites(user_id)
- reviews(vehicle_id)
- messages(booking_id, receiver_id)

### Additional Indexes (if needed):
```sql
-- For search by brand/model
CREATE INDEX idx_vehicles_search ON vehicles(brand, model);

-- For date range queries
CREATE INDEX idx_bookings_date_range ON bookings(start_date, end_date);
```

---

## 🔄 Migration Path

If you already have data and want to preserve it:

1. **Backup existing data**:
```sql
-- Export each table
COPY profiles TO '/tmp/profiles.csv' CSV HEADER;
COPY vehicles TO '/tmp/vehicles.csv' CSV HEADER;
-- etc.
```

2. **Run clean slate script**

3. **Import data**:
```sql
-- Import each table
COPY profiles FROM '/tmp/profiles.csv' CSV HEADER;
COPY vehicles FROM '/tmp/vehicles.csv' CSV HEADER;
-- etc.
```

---

## ✅ Production Ready

This schema is production-ready and includes:
- ✅ Data integrity (foreign keys, constraints)
- ✅ Security (RLS on all tables)
- ✅ Performance (strategic indexes)
- ✅ Audit trail (timestamps)
- ✅ Scalability (proper normalization)
- ✅ Maintainability (clear naming, comments)

---

## 📞 Support

**Schema Version**: 1.0  
**Last Updated**: 2026-02-15  
**Compatible with**: Supabase PostgreSQL 15+

For issues or questions, refer to the main SQL file: `database-schema.sql`
