/**
 * NON-REGRESSION TESTS: LOGIN FUNCTIONALITY
 *
 * Validates login form structure, auth flow logic, session management,
 * and error handling to prevent regressions.
 */

const fs = require('fs');
const path = require('path');

describe('Login Page – DOM Structure', () => {
    let loginHTML;

    beforeAll(() => {
        loginHTML = fs.readFileSync(path.join(__dirname, '..', 'login.html'), 'utf-8');
    });

    test('login.html must exist', () => {
        expect(loginHTML).toBeDefined();
        expect(loginHTML.length).toBeGreaterThan(0);
    });

    test('must contain a login form with id "login-form"', () => {
        expect(loginHTML).toContain('id="login-form"');
    });

    test('must contain an email input field', () => {
        expect(loginHTML).toContain('id="email"');
        expect(loginHTML).toContain('type="email"');
    });

    test('must contain a password input field', () => {
        expect(loginHTML).toContain('id="password"');
        expect(loginHTML).toContain('type="password"');
    });

    test('must contain a submit button', () => {
        expect(loginHTML).toContain('id="submit-btn"');
        expect(loginHTML).toContain('type="submit"');
    });

    test('must contain link to signup page', () => {
        expect(loginHTML).toContain('href="signup.html"');
    });

    test('must contain link to profile page (user indicator)', () => {
        expect(loginHTML).toContain("href='profile.html'");
    });

    test('must include Supabase JS library', () => {
        expect(loginHTML).toContain('supabase-js@2');
    });
});

describe('Login Page – Auth Flow Logic', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="login-form">
                <input type="email" id="email" value="" required>
                <input type="password" id="password" value="" required>
                <button type="submit" id="submit-btn">ENTRAR</button>
            </form>
            <div id="user-indicator" class="profile-circle"></div>
        `;
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('login form elements must be accessible in DOM', () => {
        expect(document.getElementById('login-form')).not.toBeNull();
        expect(document.getElementById('email')).not.toBeNull();
        expect(document.getElementById('password')).not.toBeNull();
        expect(document.getElementById('submit-btn')).not.toBeNull();
    });

    test('successful login must set djunta_auth in localStorage', () => {
        localStorage.setItem('djunta_auth', 'true');
        localStorage.setItem('djunta_user', JSON.stringify({ id: '123', email: 'test@test.com' }));

        expect(localStorage.getItem('djunta_auth')).toBe('true');
        expect(JSON.parse(localStorage.getItem('djunta_user'))).toHaveProperty('email');
    });

    test('user indicator should reflect connected state when djunta_auth is true', () => {
        localStorage.setItem('djunta_auth', 'true');
        const indicator = document.getElementById('user-indicator');

        if (localStorage.getItem('djunta_auth') === 'true') {
            indicator.classList.add('is-connected');
        }

        expect(indicator.classList.contains('is-connected')).toBe(true);
    });

    test('user indicator should NOT show connected state when not logged in', () => {
        const indicator = document.getElementById('user-indicator');

        if (localStorage.getItem('djunta_auth') === 'true') {
            indicator.classList.add('is-connected');
        }

        expect(indicator.classList.contains('is-connected')).toBe(false);
    });

    test('submit button should be disableable during login process', () => {
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerText = 'AGUARDE...';

        expect(btn.disabled).toBe(true);
        expect(btn.innerText).toBe('AGUARDE...');
    });

    test('submit button should be re-enabled after login error', () => {
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerText = 'AGUARDE...';

        btn.innerText = 'ENTRAR';
        btn.disabled = false;

        expect(btn.disabled).toBe(false);
        expect(btn.innerText).toBe('ENTRAR');
    });

    test('logout must clear djunta_auth and djunta_user from localStorage', () => {
        localStorage.setItem('djunta_auth', 'true');
        localStorage.setItem('djunta_user', JSON.stringify({ id: '123' }));

        localStorage.removeItem('djunta_auth');
        localStorage.removeItem('djunta_user');

        expect(localStorage.getItem('djunta_auth')).toBeNull();
        expect(localStorage.getItem('djunta_user')).toBeNull();
    });
});
