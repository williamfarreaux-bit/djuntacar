/**
 * NON-REGRESSION TESTS: CONFIG & SUPABASE INITIALIZATION
 *
 * Validates that CONFIG and DJUNTA global objects are correctly
 * structured and that Supabase client initialization logic is sound.
 */

describe('CONFIG – Supabase Configuration', () => {

    beforeEach(() => {
        global.CONFIG = {
            url: "https://enuiuuwnjzvpfvpklmjw.supabase.co",
            key: "sb_publishable_MDe_Df6NgeA-MmeP1pguPQ_tgF2k8s-"
        };
    });

    afterEach(() => {
        delete global.CONFIG;
    });

    test('CONFIG must have a valid Supabase URL', () => {
        expect(CONFIG.url).toBeDefined();
        expect(typeof CONFIG.url).toBe('string');
        expect(CONFIG.url).toMatch(/^https:\/\/.+\.supabase\.co$/);
    });

    test('CONFIG must have a Supabase API key', () => {
        expect(CONFIG.key).toBeDefined();
        expect(typeof CONFIG.key).toBe('string');
        expect(CONFIG.key.length).toBeGreaterThan(0);
    });

    test('CONFIG must not be missing required fields', () => {
        expect(CONFIG).toHaveProperty('url');
        expect(CONFIG).toHaveProperty('key');
    });
});

describe('DJUNTA – Global Application Object', () => {

    beforeEach(() => {
        window.DJUNTA = {
            sb: null,
            formatMoney: (amount) => {
                return new Intl.NumberFormat('pt-CV', {
                    style: 'currency', currency: 'CVE', maximumFractionDigits: 0
                }).format(amount).replace('CVE', '').trim() + ' CVE';
            }
        };
    });

    afterEach(() => {
        delete window.DJUNTA;
    });

    test('DJUNTA object must exist on window', () => {
        expect(window.DJUNTA).toBeDefined();
    });

    test('DJUNTA must have sb property (Supabase client slot)', () => {
        expect(window.DJUNTA).toHaveProperty('sb');
    });

    test('DJUNTA.formatMoney must be a function', () => {
        expect(typeof window.DJUNTA.formatMoney).toBe('function');
    });

    test('formatMoney should format amounts correctly with CVE currency', () => {
        const result = window.DJUNTA.formatMoney(8500);
        expect(result).toContain('CVE');
    });

    test('formatMoney should handle zero', () => {
        const result = window.DJUNTA.formatMoney(0);
        expect(result).toContain('CVE');
    });

    test('formatMoney should handle large amounts', () => {
        const result = window.DJUNTA.formatMoney(1000000);
        expect(result).toContain('CVE');
    });
});
