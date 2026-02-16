# How to Test the Persistent Language Selector

## Quick Test Guide

### Test 1: Basic Language Switching
1. Open `index.html` in your browser
2. Click on the language selector in the top-right corner (shows "FR" by default)
3. Select "Português" from the dropdown
4. **Verify:**
   - Label changes to "PT"
   - All text on page switches to Portuguese
   - Dropdown closes automatically

### Test 2: Persistence After Reload
1. After changing language to "PT" in Test 1
2. Press `F5` or reload the page
3. **Verify:**
   - Page loads with Portuguese already applied
   - Language selector shows "PT" immediately
   - No flicker or language change during load

### Test 3: Using Browser DevTools
1. Open browser DevTools (`F12`)
2. Go to the **Console** tab
3. Type: `localStorage.getItem('djunta_lang')`
4. Press Enter
5. **Verify:** Returns `'PT'` or `'FR'` or `'EN'`

### Test 4: Clear Storage and Test Default
1. In Console, type: `localStorage.removeItem('djunta_lang')`
2. Reload the page
3. **Verify:**
   - Page loads in French (FR) - the default
   - Language selector shows "FR"
   - localStorage is set to 'FR' after initialization

### Test 5: Switch Between All Languages
1. Click language selector
2. Select "English"
3. Verify page is in English
4. Click again, select "Français"
5. Verify page is in French
6. Check console for log messages: `Language switched to: EN`, etc.

### Test 6: Using the Test Page
1. Open `test-language-persistence.html` in your browser
2. You'll see a test interface with multiple test sections
3. Follow the interactive tests:
   - **Test 1**: Click language buttons to switch
   - **Test 2**: Reload to verify persistence
   - **Test 3**: Clear storage to reset
4. All results display on the page with ✅ or ❌

## Advanced Testing

### Test 7: localStorage in DevTools Storage Tab
1. Open DevTools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Navigate to **Local Storage** → `file://` or your domain
4. Find the key `djunta_lang`
5. **Verify:** 
   - Value is 'FR', 'PT', or 'EN'
   - Updates immediately when you change language on the page

### Test 8: HTML Lang Attribute
1. Open DevTools
2. Go to **Elements** tab
3. Find the `<html>` tag at the very top
4. **Verify:** 
   - `lang` attribute shows "fr", "pt", or "en"
   - Updates when you switch language

### Test 9: Network Tab (Geo-Detection)
1. Clear localStorage: `localStorage.removeItem('djunta_lang')`
2. Open DevTools → **Network** tab
3. Reload the page
4. **Verify:** 
   - Request to `ipapi.co/json/` appears (geo-detection)
   - If request succeeds, language set based on country
   - If request fails, defaults to 'FR'

### Test 10: Multiple Tabs/Windows
1. Open `index.html` in Tab 1
2. Switch language to "PT"
3. Open `index.html` in Tab 2 (new tab)
4. **Verify:** 
   - Tab 2 immediately shows Portuguese
   - Both tabs share the same localStorage
   - Change in one tab persists for new tabs

## Expected Console Output

When you open the page, you should see:
```
Language switched to: FR
```
(or PT/EN depending on your stored preference)

When you switch language:
```
Language switched to: PT
```

## Verification Checklist

Use this checklist to verify the implementation:

- [ ] Language selector button exists in header
- [ ] Clicking selector opens dropdown with 3 options (FR, PT, EN)
- [ ] Clicking an option changes the language immediately
- [ ] All `data-i18n` elements translate correctly
- [ ] Language selector label updates to show current language
- [ ] Dropdown closes after selection
- [ ] localStorage is updated immediately (check DevTools)
- [ ] HTML lang attribute updates (check DevTools Elements)
- [ ] Page reload maintains selected language
- [ ] Console shows "Language switched to: XX" messages
- [ ] Test page (`test-language-persistence.html`) passes all tests

## Troubleshooting

### Issue: Language doesn't persist after reload
**Solution:** Check if localStorage is enabled in your browser:
```javascript
// In console
localStorage.setItem('test', 'works');
localStorage.getItem('test'); // Should return 'works'
```

### Issue: Translations don't apply
**Solution:** Check if dictionary object exists:
```javascript
// In console
console.log(dictionary);
```

### Issue: Geo-detection not working
**Solution:** This is expected behavior if:
- You're testing on `file://` protocol
- You're offline
- CORS is blocking the request
- The API is down

The system will automatically fall back to 'FR' (default).

### Issue: Console errors
**Solution:** Check for:
- Missing elements (e.g., `#current-lang-label`)
- Invalid language codes passed to `switchLanguage()`
- Network connectivity issues

## Browser Compatibility Testing

Test on these browsers to ensure compatibility:

- [ ] Chrome/Chromium (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

## What Should Work

✅ Language switching
✅ localStorage persistence
✅ Page reload
✅ Multiple tabs
✅ UI synchronization
✅ Fallback to default
✅ Translation application
✅ SEO (HTML lang attribute)

## What Won't Work Without Backend

❌ Language sync across devices
❌ Language preference for logged-out users on other computers
❌ Analytics on language preferences

(These require server-side storage)

## Success Criteria

The implementation is successful if:

1. **Storage**: `localStorage.getItem('djunta_lang')` returns correct value
2. **Initialization**: Page loads with correct language from storage
3. **UI Sync**: Language selector always shows current language
4. **Modularity**: `switchLanguage()` function works from console
5. **Persistence**: Language survives page reload and browser restart

All criteria should be met! ✅
