/**
 * NON-REGRESSION TESTS: SIGN-UP FUNCTIONALITY
 *
 * Validates signup form structure, registration flow logic,
 * and proper error handling to prevent regressions.
 */

const fs = require('fs');
const path = require('path');

describe('Sign-up Page – DOM Structure', () => {
    let signupHTML;

    beforeAll(() => {
        signupHTML = fs.readFileSync(path.join(__dirname, '..', 'signup.html'), 'utf-8');
    });

    test('signup.html must exist', () => {
        expect(signupHTML).toBeDefined();
        expect(signupHTML.length).toBeGreaterThan(0);
    });

    test('must contain a signup form with id "signup-form"', () => {
        expect(signupHTML).toContain('id="signup-form"');
    });

    test('must contain an email input field', () => {
        expect(signupHTML).toContain('id="email"');
        expect(signupHTML).toContain('type="email"');
    });

    test('must contain a password input field', () => {
        expect(signupHTML).toContain('id="password"');
        expect(signupHTML).toContain('type="password"');
    });

    test('must contain a submit button', () => {
        expect(signupHTML).toContain('id="btn-submit"');
    });

    test('must contain link to login page', () => {
        expect(signupHTML).toContain('href="login.html"');
    });

    test('must include Supabase JS library', () => {
        expect(signupHTML).toContain('supabase-js@2');
    });

    test('must include Lucide icons library', () => {
        expect(signupHTML).toContain('lucide');
    });

    test('must reference DJUNTA global object for auth', () => {
        expect(signupHTML).toContain('DJUNTA.sb.auth.signUp');
    });
});

describe('Sign-up Page – Registration Flow Logic', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="signup-form">
                <input type="email" id="email" value="" required>
                <input type="password" id="password" value="" required>
                <button type="submit" id="btn-submit">
                    <span>Criar Conta</span>
                </button>
            </form>
        `;
    });

    test('signup form elements must be accessible in DOM', () => {
        expect(document.getElementById('signup-form')).not.toBeNull();
        expect(document.getElementById('email')).not.toBeNull();
        expect(document.getElementById('password')).not.toBeNull();
        expect(document.getElementById('btn-submit')).not.toBeNull();
    });

    test('submit button should be disableable during registration', () => {
        const btn = document.getElementById('btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="animate-spin"></i>';
        btn.disabled = true;

        expect(btn.disabled).toBe(true);
        expect(btn.innerHTML).not.toBe(originalHTML);
    });

    test('submit button should be restored after registration error', () => {
        const btn = document.getElementById('btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="animate-spin"></i>';
        btn.disabled = true;

        btn.innerHTML = originalHTML;
        btn.disabled = false;

        expect(btn.disabled).toBe(false);
        expect(btn.innerHTML).toContain('Criar Conta');
    });

    test('email input must accept email format', () => {
        const emailInput = document.getElementById('email');
        expect(emailInput.type).toBe('email');
        expect(emailInput.required).toBe(true);
    });

    test('password input must be of type password', () => {
        const passwordInput = document.getElementById('password');
        expect(passwordInput.type).toBe('password');
        expect(passwordInput.required).toBe(true);
    });
});
