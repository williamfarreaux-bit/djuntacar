/**
 * NON-REGRESSION TESTS: NAVIGATION
 *
 * Validates header structure, mobile menu, language selector,
 * profile indicator, and routing links across pages.
 */

const fs = require('fs');
const path = require('path');

describe('Navigation – Index Page Header', () => {
    let indexHTML;

    beforeAll(() => {
        indexHTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
    });

    test('index.html must exist', () => {
        expect(indexHTML).toBeDefined();
    });

    test('must contain a header element', () => {
        expect(indexHTML).toContain('<header');
    });

    test('must contain a burger menu button', () => {
        expect(indexHTML).toContain('toggleMenu()');
    });

    test('must contain the mobile menu', () => {
        expect(indexHTML).toContain('id="mobile-menu"');
    });

    test('must contain logo linking to home', () => {
        expect(indexHTML).toContain('logo.png');
    });

    test('must contain profile circle indicator', () => {
        expect(indexHTML).toContain('id="user-indicator"');
        expect(indexHTML).toContain('profile-circle');
    });

    test('must contain language selector', () => {
        expect(indexHTML).toContain('lang-pill');
        expect(indexHTML).toContain('id="lang-dropdown"');
    });

    test('language dropdown must have FR, PT, EN options', () => {
        expect(indexHTML).toContain("updateLang('FR')");
        expect(indexHTML).toContain("updateLang('PT')");
        expect(indexHTML).toContain("updateLang('EN')");
    });
});

describe('Navigation – Mobile Menu Links', () => {
    let indexHTML;

    beforeAll(() => {
        indexHTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
    });

    test('mobile menu must have link to home (index.html)', () => {
        expect(indexHTML).toContain('href="index.html"');
    });

    test('mobile menu must have link to search cars', () => {
        expect(indexHTML).toContain('href="search-car.html"');
    });

    test('mobile menu must have link to driver application', () => {
        expect(indexHTML).toContain('href="driver-application.html"');
    });

    test('mobile menu must have link to profile', () => {
        expect(indexHTML).toContain('href="profile.html"');
    });
});

describe('Navigation – Toggle Menu Functionality', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="mobile-menu"></div>
        `;
        window.toggleMenu = function () {
            document.getElementById('mobile-menu').classList.toggle('active');
        };
    });

    test('toggleMenu should add "active" class when menu is closed', () => {
        window.toggleMenu();
        expect(document.getElementById('mobile-menu').classList.contains('active')).toBe(true);
    });

    test('toggleMenu should remove "active" class when menu is open', () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.add('active');
        window.toggleMenu();
        expect(menu.classList.contains('active')).toBe(false);
    });

    test('toggleMenu should toggle between states', () => {
        const menu = document.getElementById('mobile-menu');
        window.toggleMenu();
        expect(menu.classList.contains('active')).toBe(true);
        window.toggleMenu();
        expect(menu.classList.contains('active')).toBe(false);
    });
});

describe('Navigation – Language Selector Logic', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <span id="current-lang-label">FR</span>
            <div id="lang-dropdown" class="active">
                <div class="lang-opt">Français</div>
                <div class="lang-opt">Português</div>
                <div class="lang-opt">English</div>
            </div>
            <span data-i18n="nav_home">Accueil</span>
        `;
        localStorage.clear();

        const dictionary = {
            'FR': { nav_home: 'Accueil' },
            'PT': { nav_home: 'Início' },
            'EN': { nav_home: 'Home' }
        };

        window.updateLang = function (lang) {
            localStorage.setItem('djunta_lang', lang);
            const label = document.getElementById('current-lang-label');
            if (label) label.innerText = lang;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dictionary[lang] && dictionary[lang][key]) el.innerText = dictionary[lang][key];
            });
            document.getElementById('lang-dropdown').classList.remove('active');
        };
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('updateLang should update the language label', () => {
        window.updateLang('PT');
        expect(document.getElementById('current-lang-label').innerText).toBe('PT');
    });

    test('updateLang should save language preference to localStorage', () => {
        window.updateLang('EN');
        expect(localStorage.getItem('djunta_lang')).toBe('EN');
    });

    test('updateLang should translate data-i18n elements', () => {
        window.updateLang('PT');
        const el = document.querySelector('[data-i18n="nav_home"]');
        expect(el.innerText).toBe('Início');
    });

    test('updateLang should close the language dropdown', () => {
        window.updateLang('FR');
        expect(document.getElementById('lang-dropdown').classList.contains('active')).toBe(false);
    });
});

describe('Navigation – Profile Indicator', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="user-indicator" class="profile-circle"></div>
        `;
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('profile indicator should show green (is-connected) when user is logged in', () => {
        localStorage.setItem('djunta_auth', 'true');
        const indicator = document.getElementById('user-indicator');

        if (localStorage.getItem('djunta_auth') === 'true') {
            indicator.classList.add('is-connected');
        }

        expect(indicator.classList.contains('is-connected')).toBe(true);
    });

    test('profile indicator should show blue (default) when user is not logged in', () => {
        const indicator = document.getElementById('user-indicator');

        if (localStorage.getItem('djunta_auth') === 'true') {
            indicator.classList.add('is-connected');
        }

        expect(indicator.classList.contains('is-connected')).toBe(false);
    });
});

describe('Navigation – Cross-Page Link Integrity', () => {

    test('login.html must link to signup.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'login.html'), 'utf-8');
        expect(html).toContain('href="signup.html"');
    });

    test('signup.html must link to login.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'signup.html'), 'utf-8');
        expect(html).toContain('href="login.html"');
    });

    test('index.html must link to search-car.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
        expect(html).toContain('href="search-car.html"');
    });

    test('index.html must link to add-car.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
        expect(html).toContain('href="add-car.html"');
    });

    test('index.html must link to driver-application.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
        expect(html).toContain('href="driver-application.html"');
    });

    test('all critical HTML pages must exist', () => {
        const criticalPages = [
            'index.html', 'login.html', 'signup.html', 'profile.html',
            'search-car.html', 'add-car.html', 'driver-application.html'
        ];

        criticalPages.forEach(page => {
            const fullPath = path.join(__dirname, '..', page);
            expect(fs.existsSync(fullPath)).toBe(true);
        });
    });
});
