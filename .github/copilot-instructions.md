# DjuntaCar - GitHub Copilot Instructions

## Project Overview

DjuntaCar is a Progressive Web App (PWA) for car rental and ride-sharing services in Cape Verde (Cabo Verde). The application enables users to rent vehicles, book drivers, manage their profiles, process payments, and communicate through an integrated chat system. The platform serves both individual users looking to rent cars and drivers offering their services.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide Icons (via CDN)
- **Backend/Database**: Supabase (Backend-as-a-Service)
- **PWA**: Service Worker for offline capabilities, Web App Manifest
- **Internationalization**: Custom i18n engine supporting French (FR), English (EN), and Portuguese (PT)
- **No Build System**: Direct browser execution, no bundler or transpilation

## Architecture

- **Client-side only**: All code runs in the browser
- **CDN Dependencies**: Tailwind CSS, Supabase client, Lucide icons loaded via CDN
- **Supabase Integration**: Database operations through `db-service.js` and global `DJUNTA` object
- **Single Page Components**: Each HTML file represents a complete page
- **Shared Components**: Header and navigation defined in `djunta-master.js` as custom web component

## Key Files

- `djunta-master.js` - Core initialization, Supabase config, header component, utility functions
- `db-service.js` - Database service layer for Supabase operations
- `i18n-engine.js` - Internationalization engine for multi-language support
- `sw.js` - Service worker for PWA offline functionality
- `manifest.json` - PWA manifest configuration
- `style.css` - Global styles and custom CSS beyond Tailwind

## Coding Guidelines

### General Practices

- **Keep it simple**: This is a vanilla JavaScript project. Avoid introducing frameworks or build tools.
- **Preserve existing patterns**: Follow the coding style and patterns already present in the codebase.
- **Minimal dependencies**: Only use CDN-based libraries. Never add npm packages or build systems.
- **Browser compatibility**: Ensure code works in modern browsers without transpilation.

### JavaScript

- Use modern ES6+ features (const/let, arrow functions, async/await, template literals)
- Avoid using `var` - use `const` by default, `let` when reassignment is needed
- Use async/await for asynchronous operations, especially with Supabase
- Access Supabase client via `window.DJUNTA.sb` or the global `_supabase` variable
- Use `window.DJUNTA.formatMoney()` for currency formatting (Cape Verdean Escudo - CVE)
- Always check for errors in Supabase responses: `const { data, error } = await ...`

### HTML

- Maintain the existing structure with fixed header, main content, and fixed bottom navigation
- Use semantic HTML5 elements where appropriate
- Include responsive meta tags: `viewport-fit=cover` for mobile devices
- Keep inline styles minimal - prefer Tailwind utility classes
- Use `data-i18n` attributes for translatable text elements

### CSS/Styling

- **Prioritize Tailwind CSS utility classes** for styling
- Use inline `<style>` tags in HTML files for component-specific styles
- Follow the mobile-first responsive design approach
- Maintain consistent spacing: `padding-top: 75px` for header, `padding-bottom: 160px` for bottom nav
- Use the primary brand color: `#1d4379` (DjuntaCar blue)
- Ensure tap targets are at least 44x44px for mobile usability

### Internationalization

- All user-facing text must support FR, EN, and PT
- Add `data-i18n="key_name"` attribute to elements that need translation
- Define translation keys in the appropriate translation file
- Use `I18n.setLanguage()` to change languages programmatically
- Test language switching functionality when adding new UI text

### Supabase/Database

- Use the `DjuntaDB` service object for common database operations
- Always handle errors from Supabase operations gracefully
- Follow the existing pattern for queries: `.select()`, `.eq()`, `.single()`, etc.
- Be mindful of Row Level Security (RLS) policies when accessing data
- Use `.from('table_name')` for all table operations

### PWA/Service Worker

- Update `CACHE_NAME` version when modifying cached assets
- Add new critical assets to `ASSETS_TO_CACHE` array in `sw.js`
- Test offline functionality after service worker changes
- Ensure the manifest.json stays valid for app installation

### Security

- Never commit Supabase service role keys or sensitive credentials to the repository
- Use Supabase's built-in authentication and RLS for security
- Sanitize user inputs before displaying or storing
- Be cautious with `innerHTML` - prefer `textContent` when possible

### Testing

- Test manually in browser (no automated test framework)
- Verify mobile responsiveness in browser DevTools
- Test all three language versions (FR, EN, PT)
- Check PWA installation and offline functionality
- Test Supabase operations with actual database

## Common Tasks

### Adding a New Page

1. Create new HTML file with standard structure (header, main content, bottom nav)
2. Include Tailwind CSS and Supabase CDN links
3. Include `djunta-master.js` and `i18n-engine.js` if needed
4. Add page-specific JavaScript in `<script>` tag at the bottom
5. Add translations for all user-facing text
6. Test responsive design on mobile and desktop

### Adding Database Operations

1. Add new methods to `DjuntaDB` object in `db-service.js` if shared
2. Use async/await with try-catch for error handling
3. Follow naming convention: `getX`, `createX`, `updateX`, `deleteX`
4. Return data on success, null/empty array on error
5. Log errors to console for debugging

### Internationalization

1. Add text keys to translation dictionaries (if separate file exists)
2. Use `data-i18n="key_name"` on HTML elements
3. Call `I18n.apply()` after dynamically creating elements
4. Use meaningful, descriptive key names (e.g., `car_detail_price` not `text1`)

## Don'ts

- ❌ Don't add Node.js, npm, webpack, or any build tools
- ❌ Don't introduce React, Vue, Angular, or other frameworks
- ❌ Don't remove or modify the Supabase configuration without explicit instruction
- ❌ Don't change the core structure of `djunta-master.js` header component
- ❌ Don't use jQuery or other legacy libraries
- ❌ Don't add server-side code (this is a client-only application)
- ❌ Don't modify service worker caching logic without updating version number
- ❌ Don't break mobile responsiveness or PWA installation capability

## Resources

- [Supabase JavaScript Client Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Lucide Icons](https://lucide.dev/)

## File Naming Conventions

- HTML pages: lowercase with hyphens (e.g., `car-detail.html`)
- JavaScript files: lowercase with hyphens (e.g., `db-service.js`)
- Image files: lowercase with hyphens (e.g., `logo.png`)
- Use descriptive names that reflect the page/component purpose

## Language Context

- The application is primarily used in Cape Verde
- Portuguese is the official language, but French and English are also supported
- Currency is Cape Verdean Escudo (CVE)
- Be mindful of cultural context when adding features or content
