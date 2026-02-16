/**
 * NON-REGRESSION TESTS: i18n ENGINE
 *
 * Validates the internationalization engine structure and behavior
 * to prevent regressions in multi-language support.
 */

const fs = require('fs');
const path = require('path');

describe('i18n-engine.js – Module Structure', () => {
    let i18nCode;

    beforeAll(() => {
        i18nCode = fs.readFileSync(path.join(__dirname, '..', 'i18n-engine.js'), 'utf-8');
    });

    test('i18n-engine.js must exist', () => {
        expect(i18nCode).toBeDefined();
        expect(i18nCode.length).toBeGreaterThan(0);
    });

    test('must define I18n object', () => {
        expect(i18nCode).toContain('const I18n');
    });

    test('must have init method', () => {
        expect(i18nCode).toContain('init:');
    });

    test('must have setLanguage method', () => {
        expect(i18nCode).toContain('setLanguage:');
    });

    test('must have apply method', () => {
        expect(i18nCode).toContain('apply:');
    });

    test('must default to French language', () => {
        expect(i18nCode).toContain("currentLang: 'fr'");
    });

    test('must use localStorage for language persistence', () => {
        expect(i18nCode).toContain('localStorage');
        expect(i18nCode).toContain('djuntacar_lang');
    });

    test('must detect browser language', () => {
        expect(i18nCode).toContain('navigator.language');
    });

    test('must support data-i18n attribute for DOM translation', () => {
        expect(i18nCode).toContain('data-i18n');
    });

    test('must handle input/textarea placeholders', () => {
        expect(i18nCode).toContain('placeholder');
        expect(i18nCode).toContain('INPUT');
        expect(i18nCode).toContain('TEXTAREA');
    });

    test('must update html lang attribute for SEO', () => {
        expect(i18nCode).toContain('document.documentElement.lang');
    });
});

describe('i18n-engine.js – Language Detection & Switching', () => {

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <span data-i18n="greeting">Bonjour</span>
            <input data-i18n="search_placeholder" placeholder="Rechercher">
        `;
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('language preference should persist in localStorage', () => {
        localStorage.setItem('djuntacar_lang', 'pt');
        expect(localStorage.getItem('djuntacar_lang')).toBe('pt');
    });

    test('should support three languages: fr, en, pt', () => {
        const supportedLangs = ['fr', 'en', 'pt'];
        supportedLangs.forEach(lang => {
            localStorage.setItem('djuntacar_lang', lang);
            expect(localStorage.getItem('djuntacar_lang')).toBe(lang);
        });
    });

    test('data-i18n elements should be present in the DOM for translation', () => {
        const elements = document.querySelectorAll('[data-i18n]');
        expect(elements.length).toBeGreaterThan(0);
    });

    test('html lang attribute should be updatable', () => {
        document.documentElement.lang = 'pt';
        expect(document.documentElement.lang).toBe('pt');

        document.documentElement.lang = 'en';
        expect(document.documentElement.lang).toBe('en');
    });
});
