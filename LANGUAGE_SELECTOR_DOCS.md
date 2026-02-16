# Persistent Language Selector Implementation

## Overview
This document describes the implementation of a persistent language selector functionality using Vanilla JavaScript with localStorage for the DjuntaCar application.

## Features Implemented

### 1. **Persistent Storage**
- Language preference is saved to `localStorage` with key `djunta_lang`
- Value persists across page reloads and browser sessions
- Immediate save on language change

### 2. **Initialization on Page Load**
The system follows this priority order:
1. **Check localStorage** - If a language preference exists, use it
2. **Geo-detection fallback** - If no preference, detect user location via IP
3. **Default fallback** - If all else fails, default to French ('FR')

### 3. **UI Synchronization**
- Language selector label (`#current-lang-label`) always reflects current language
- All elements with `data-i18n` attributes are automatically translated
- HTML `lang` attribute is updated for SEO and accessibility
- Dropdown menu closes automatically after selection

### 4. **Modular Architecture**

#### `switchLanguage(lang)` Function
Clean, reusable function that handles:
- **Input validation** - Ensures language code exists in dictionary
- **Storage** - Saves to localStorage immediately
- **UI update** - Updates label and all translated elements
- **SEO** - Updates HTML lang attribute
- **UX** - Closes dropdown menu
- **Logging** - Console feedback for debugging

```javascript
function switchLanguage(lang) {
    // Validate language
    if (!dictionary[lang]) {
        console.error(`Invalid language: ${lang}`);
        return;
    }

    // 1. Save to localStorage immediately
    localStorage.setItem('djunta_lang', lang);
    
    // 2. Update UI selector label
    const label = document.getElementById('current-lang-label');
    if(label) label.innerText = lang;
    
    // 3. Apply translations to all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dictionary[lang] && dictionary[lang][key]) {
            el.innerText = dictionary[lang][key];
        }
    });
    
    // 4. Update HTML lang attribute for SEO
    document.documentElement.lang = lang.toLowerCase();
    
    // 5. Close dropdown
    const dropdown = document.getElementById('lang-dropdown');
    if(dropdown) dropdown.classList.remove('active');
    
    console.log(`Language switched to: ${lang}`);
}
```

#### `initLanguage()` Function
Initialization logic that:
- Checks localStorage first for saved preference
- Falls back to geo-detection for new users
- Applies default language ('FR') if needed
- Calls `switchLanguage()` to apply the determined language

```javascript
async function initLanguage() {
    // 1. Check localStorage first
    let lang = localStorage.getItem('djunta_lang');
    
    // 2. If no stored preference, use geo-detection as fallback
    if (!lang) {
        try {
            const res = await fetch('https://ipapi.co/json/').catch(() => null);
            if (res && res.ok) {
                const data = await res.json();
                if (data.country_code === 'FR') lang = 'FR';
                else if (['PT', 'CV'].includes(data.country_code)) lang = 'PT';
                else lang = 'EN';
            } else {
                lang = 'FR'; // Default fallback
            }
        } catch (e) {
            lang = 'FR'; // Default fallback on error
        }
    }
    
    // 3. Apply the language (this also saves to localStorage)
    switchLanguage(lang);
}
```

## Technical Implementation Details

### localStorage Key
- **Key**: `djunta_lang`
- **Values**: `'FR'`, `'PT'`, or `'EN'`
- **Storage**: Persists across browser sessions
- **Access**: `localStorage.getItem('djunta_lang')` and `localStorage.setItem('djunta_lang', value)`

### HTML Structure
```html
<!-- Language Selector Button -->
<div class="lang-pill" onclick="toggleLangMenu(event)">
    <span id="current-lang-label">FR</span>
    <svg><!-- dropdown icon --></svg>
</div>

<!-- Language Dropdown Menu -->
<div id="lang-dropdown">
    <div class="lang-opt" onclick="switchLanguage('FR')">Français</div>
    <div class="lang-opt" onclick="switchLanguage('PT')">Português</div>
    <div class="lang-opt" onclick="switchLanguage('EN')">English</div>
</div>
```

### Translation Dictionary
```javascript
const dictionary = {
    'FR': { nav_home: 'Accueil', hero_title: 'Louer une voiture au Cap-Vert', ... },
    'PT': { nav_home: 'Início', hero_title: 'Alugar um carro em Cabo Verde', ... },
    'EN': { nav_home: 'Home', hero_title: 'Rent a car in Cape Verde', ... }
};
```

### Translation Application
Elements with `data-i18n` attribute are automatically translated:
```html
<h1 data-i18n="hero_title">Louer une voiture au Cap-Vert</h1>
<a data-i18n="nav_home">Accueil</a>
```

## Usage Examples

### Manual Language Switch
```javascript
// User clicks on language option
switchLanguage('PT'); // Switches to Portuguese and saves preference
```

### Check Current Language
```javascript
const currentLang = localStorage.getItem('djunta_lang');
console.log('Current language:', currentLang); // 'FR', 'PT', or 'EN'
```

### Clear Language Preference
```javascript
// Remove stored preference (will use geo-detection on next load)
localStorage.removeItem('djunta_lang');
```

## Testing

A comprehensive test page (`test-language-persistence.html`) is included to verify:
1. ✅ Language switching updates UI immediately
2. ✅ Language preference saves to localStorage
3. ✅ Language persists after page reload
4. ✅ UI selector reflects stored language on initialization
5. ✅ Translations apply correctly to all elements
6. ✅ HTML lang attribute updates for SEO

## Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Works offline (no external dependencies for core functionality)
- ℹ️ Geo-detection requires internet connection (graceful fallback if offline)

## Benefits

1. **User Experience**
   - Language preference remembered across sessions
   - No need to select language repeatedly
   - Instant language switching without page reload

2. **Performance**
   - No server-side storage needed
   - Instant retrieval from localStorage
   - Minimal JavaScript footprint

3. **Maintainability**
   - Clean, modular code structure
   - Single responsibility functions
   - Well-documented with JSDoc comments
   - Easy to extend with new languages

4. **SEO & Accessibility**
   - HTML lang attribute properly updated
   - Semantic HTML structure maintained
   - Works without JavaScript (graceful degradation)

## Future Enhancements

Possible improvements:
- Add more languages (e.g., Spanish, Italian)
- Sync language preference across devices (requires backend)
- Add language auto-detection based on browser settings
- Implement RTL support for languages like Arabic
- Add keyboard shortcuts for language switching
