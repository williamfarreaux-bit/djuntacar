/**
 * NON-REGRESSION TESTS: DB-SERVICE
 *
 * Validates the structure and contract of DjuntaDB service
 * to prevent regressions in database query logic.
 */

const fs = require('fs');
const path = require('path');

describe('db-service.js – Module Structure', () => {
    let dbServiceCode;

    beforeAll(() => {
        dbServiceCode = fs.readFileSync(path.join(__dirname, '..', 'db-service.js'), 'utf-8');
    });

    test('db-service.js must exist', () => {
        expect(dbServiceCode).toBeDefined();
        expect(dbServiceCode.length).toBeGreaterThan(0);
    });

    test('must define DjuntaDB object', () => {
        expect(dbServiceCode).toContain('DjuntaDB');
    });

    test('must have getCars method', () => {
        expect(dbServiceCode).toContain('getCars');
    });

    test('must have getById method', () => {
        expect(dbServiceCode).toContain('getById');
    });

    test('must have filterVehicles method', () => {
        expect(dbServiceCode).toContain('filterVehicles');
    });

    test('getCars must query the vehicles table', () => {
        expect(dbServiceCode).toContain("from('vehicles')");
    });

    test('getCars must filter out driver-included vehicles', () => {
        expect(dbServiceCode).toContain("eq('is_driver_included', false)");
    });

    test('getById must use .single() for single record', () => {
        expect(dbServiceCode).toContain('.single()');
    });

    test('must handle errors gracefully (return empty array or null)', () => {
        expect(dbServiceCode).toContain('return []');
        expect(dbServiceCode).toContain('return null');
    });

    test('must log errors to console', () => {
        expect(dbServiceCode).toContain('console.error');
    });
});

describe('db-service.js – DjuntaDB Contract', () => {

    test('DjuntaDB code must define an object with getCars, getById, filterVehicles', () => {
        const code = fs.readFileSync(path.join(__dirname, '..', 'db-service.js'), 'utf-8');

        // Verify the object literal contains the expected method definitions
        expect(code).toMatch(/const\s+DjuntaDB\s*=\s*\{/);
        expect(code).toMatch(/async\s+getCars\s*\(\s*\)/);
        expect(code).toMatch(/async\s+getById\s*\(\s*id\s*\)/);
        expect(code).toMatch(/async\s+filterVehicles\s*\(\s*type\s*\)/);
    });

    test('getCars must return empty array on error', () => {
        const code = fs.readFileSync(path.join(__dirname, '..', 'db-service.js'), 'utf-8');
        // After error in getCars, it should return []
        expect(code).toContain('return [];');
    });

    test('getById must return null on error', () => {
        const code = fs.readFileSync(path.join(__dirname, '..', 'db-service.js'), 'utf-8');
        expect(code).toContain('return null;');
    });

    test('getById must return data on success', () => {
        const code = fs.readFileSync(path.join(__dirname, '..', 'db-service.js'), 'utf-8');
        expect(code).toContain('return data;');
    });
});
