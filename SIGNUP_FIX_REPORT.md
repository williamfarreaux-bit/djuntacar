# Sign-up Infinite Spinner - Diagnostic & Fix Report

**Issue**: Users experience infinite spinner when clicking "Register" button. No error messages shown, button never resets.

**Root Causes Identified**: 5 critical issues

---

## 🔴 Problem 1: Missing Script File

**What was wrong:**
```html
<script src="djunta-core.js" defer></script>
```

**Issue:** `djunta-core.js` does not exist in the repository. This caused:
- `DJUNTA` object never initialized
- `DJUNTA.sb` (Supabase client) undefined
- SignUp call fails silently

**Fix:**
```html
<script src="djunta-master.js"></script>
```

**Impact:** CRITICAL - Signup could never work without this fix.

---

## 🔴 Problem 2: Metadata Mismatch

**SQL Trigger expects:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),  -- Expects 'full_name'
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**JavaScript was sending:**
```javascript
// BEFORE (BROKEN):
await DJUNTA.sb.auth.signUp({
    email: email,
    password: password
    // NO METADATA AT ALL!
});
```

**Result:** Profile created with empty `full_name`, but transaction might hang waiting for constraints.

**Fix:**
```javascript
// AFTER (FIXED):
await DJUNTA.sb.auth.signUp({
    email: email,
    password: password,
    options: {
        data: {
            full_name: fullName,
            first_name: firstName,
            last_name: lastName
        },
        emailRedirectTo: window.location.origin + '/login.html'
    }
});
```

**Impact:** HIGH - Transaction could hang indefinitely if trigger fails.

---

## 🔴 Problem 3: No Error Handling

**What was wrong:**
```javascript
// BEFORE (BROKEN):
const { data, error } = await DJUNTA.sb.auth.signUp({...});

if (error) {
    alert("Erro: " + error.message);  // Generic alert
    btn.innerHTML = originalText;
    btn.disabled = false;
} else {
    alert("Conta criada com sucesso!");
    window.location.href = 'login.html';
}
```

**Issues:**
- No try/catch block → Uncaught exceptions freeze UI
- No timeout → Infinite wait if network hangs
- Generic error message → User doesn't know what went wrong
- Button only reset in `if (error)` path → Doesn't cover all failure modes

**Fix:**
```javascript
// AFTER (FIXED):
try {
    // 10-second timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), 10000);
    });

    // Race between signup and timeout
    const { data, error } = await Promise.race([
        signupPromise,
        timeoutPromise
    ]);

    if (error) throw error;
    
    // Success handling...

} catch (error) {
    // Always reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
    
    // Categorize error type
    if (error.message === 'TIMEOUT') {
        // Show timeout message
    } else if (error.message.includes('fetch')) {
        // Network error
    } else if (error.message.includes('already registered')) {
        // Auth error - duplicate email
    } else if (error.message.includes('Database')) {
        // Database error
    }
    // ... more error types
}
```

**Impact:** CRITICAL - Without this, spinner never stops on errors.

---

## 🔴 Problem 4: No Timeout Mechanism

**What was wrong:**
```javascript
const { data, error } = await DJUNTA.sb.auth.signUp({...});
// Waits forever if network is slow or server is down
```

**Fix:**
```javascript
const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), 10000);
});

const { data, error } = await Promise.race([
    DJUNTA.sb.auth.signUp({...}),
    timeoutPromise
]);
```

**Impact:** HIGH - Users wait indefinitely without feedback.

---

## 🔴 Problem 5: Missing Production URL

**What was wrong:**
```javascript
await DJUNTA.sb.auth.signUp({
    email: email,
    password: password
    // No redirectTo parameter
});
```

**Issue:** Supabase sends confirmation email with wrong redirect URL in production.

**Fix:**
```javascript
options: {
    emailRedirectTo: window.location.origin + '/login.html'
}
```

**Impact:** MEDIUM - Email confirmation fails in production.

---

## ✅ Complete Fix Summary

### signup.html Changes

1. **Script Reference**
   ```html
   <!-- Before -->
   <script src="djunta-core.js" defer></script>
   
   <!-- After -->
   <script src="djunta-master.js"></script>
   ```

2. **Added Full Name Field**
   ```html
   <div>
       <label>Nome Completo</label>
       <input type="text" id="full_name" required placeholder="João Silva">
   </div>
   ```

3. **Added Error Display Container**
   ```html
   <div id="error-container" class="hidden">
       <div class="bg-red-50 border border-red-200 rounded-lg p-3">
           <p id="error-message"></p>
           <p id="error-details"></p>
       </div>
   </div>
   ```

4. **Complete Script Rewrite**
   - Try/catch/finally error handling
   - 10-second timeout using Promise.race
   - Metadata alignment (full_name, first_name, last_name)
   - Error type detection (Network/Auth/Database)
   - Console logging for debugging
   - Button state always reset

### db-service.js Changes

Added reusable signup function:
```javascript
async signUp(email, password, fullName) {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
                first_name: firstName,
                last_name: lastName
            },
            emailRedirectTo: window.location.origin + '/login.html'
        }
    });
}
```

---

## 🧪 Testing Checklist

### Test 1: Valid Signup
- [ ] Enter valid name, email, and password
- [ ] Click "Criar Conta"
- [ ] Should see loading spinner
- [ ] Should get success message
- [ ] Should redirect to login page
- [ ] Check Supabase Auth: User exists
- [ ] Check profiles table: full_name populated

### Test 2: Existing Email
- [ ] Use already registered email
- [ ] Should show error: "Email já cadastrado"
- [ ] Error details: "Tipo: AUTH"
- [ ] Button should reset

### Test 3: Weak Password
- [ ] Use password < 6 characters
- [ ] Should show error: "Senha muito fraca"
- [ ] Error details: "Tipo: AUTH"

### Test 4: Network Timeout
- [ ] Disconnect internet before clicking submit
- [ ] Should wait max 10 seconds
- [ ] Should show: "Tempo esgotado (> 10s)"
- [ ] Error details: "Tipo: NETWORK"

### Test 5: Invalid Email
- [ ] Enter "invalid-email"
- [ ] Should show error about invalid data
- [ ] Error details: "Tipo: AUTH"

### Test 6: Button State
- [ ] Submit form
- [ ] During loading: Button disabled, shows spinner
- [ ] On error: Button re-enabled, original text restored
- [ ] Can submit again after error

### Test 7: Console Logging
- [ ] Open browser console
- [ ] Submit form
- [ ] Should see logs:
   - "✅ Supabase client initialized"
   - "🔄 Starting signup process..."
   - "Email: xxx"
   - "Full Name: xxx"
   - Either "✅ Signup successful" or "❌ Signup error"

---

## 📊 Error Message Matrix

| Error Type | Condition | Message | Details |
|------------|-----------|---------|---------|
| TIMEOUT | > 10 seconds | "Tempo esgotado (> 10s)" | "Tipo: NETWORK \| Verifique sua conexão" |
| NETWORK | Fetch failed | "Erro de conexão" | "Tipo: NETWORK \| Não foi possível conectar" |
| AUTH | Email exists | "Email já cadastrado" | "Tipo: AUTH \| Email já está em uso" |
| AUTH | Weak password | "Senha muito fraca" | "Tipo: AUTH \| Use pelo menos 6 caracteres" |
| AUTH | Invalid data | "Dados inválidos" | "Tipo: AUTH \| Verifique o email" |
| DATABASE | Trigger fails | "Erro no banco de dados" | "Tipo: DATABASE \| Contacte o suporte" |
| UNKNOWN | Other | Error message | "Tipo: UNKNOWN \| Contacte o suporte" |

---

## 🔧 Debugging Tips

### If signup still hangs:

1. **Check browser console:**
   ```javascript
   // Should see this log:
   "✅ Supabase client initialized"
   ```
   If not, DJUNTA.sb is not initialized.

2. **Check Supabase connection:**
   ```javascript
   // In console:
   console.log(window.DJUNTA.sb);
   // Should output Supabase client object
   ```

3. **Check network tab:**
   - Look for POST request to Supabase
   - Check response status
   - Check response time

4. **Check SQL trigger:**
   ```sql
   -- In Supabase SQL Editor:
   SELECT * FROM pg_stat_user_functions 
   WHERE funcname = 'handle_new_user';
   ```

5. **Check profiles table:**
   ```sql
   SELECT id, email, full_name, created_at 
   FROM profiles 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

### Common Issues After Fix:

- **"Sistema não inicializado"**: djunta-master.js not loaded correctly
- **Still hanging**: Check Supabase URL/key in djunta-master.js
- **Error about metadata**: Check SQL trigger is deployed
- **Timeout on fast connection**: Increase timeout from 10s to 15s

---

## 🎯 Deliverables Completed

✅ **1. Corrected signUp function for db-service.js**
   - Added DjuntaDB.signUp() method
   - Proper metadata structure
   - Console logging

✅ **2. Error-handling script for sign-up page**
   - Shows EXACT error type (Network/Database/Auth)
   - Timeout mechanism (10s)
   - Try/catch/finally blocks
   - User-friendly error messages
   - Button state management

✅ **3. Metadata alignment**
   - full_name, first_name, last_name sent correctly
   - Matches SQL trigger expectations

✅ **4. Production URL handling**
   - emailRedirectTo uses window.location.origin
   - Works in dev and production

---

## 📝 Deployment Notes

1. Deploy signup.html and db-service.js
2. Clear browser cache (Ctrl+Shift+R)
3. Test signup flow thoroughly
4. Monitor Supabase logs for trigger errors
5. Check profiles table for proper metadata

**Expected Result:** No more infinite spinners! Users see clear error messages and can retry immediately.
