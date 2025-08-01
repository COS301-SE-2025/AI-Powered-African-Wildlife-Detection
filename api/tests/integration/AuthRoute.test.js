import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/db/index.js';
import authApp from '../../src/routes/authRoute.js';

let gatewayServer;
let authServer;

beforeAll((done) => {
	const AUTH_PORT = process.env.AUTH_PORT || 4001;
	const GATEWAY_PORT = process.env.PORT || 3000;

	authServer = authApp.listen(AUTH_PORT, () => {
		console.log(`✅ Auth service running on port ${AUTH_PORT}`);
		gatewayServer = app.listen(GATEWAY_PORT, () => {
			console.log(`✅ API Gateway running on port ${GATEWAY_PORT}`);
			done();
		});
	});
});

afterAll(async () => {
	await new Promise((resolve) => gatewayServer.close(resolve));
	await new Promise((resolve) => authServer.close(resolve));
	await db.close();
});

beforeEach(async () => {
	await db.query('DELETE FROM users');
});

describe('Full Auth Flow', () => {
	test('POST /auth/register should create a user', async () => {
		try {
			const res = await request(app).post('/auth/register').send({
				username: 'testuser',
				email: 'test@example.com',
				password: 'securepass',
			});

			// console.log('Registration response:', res);

			expect(res.statusCode).toBe(201);
			expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('token='));
			expect(res.body).toHaveProperty('message', 'User registered successfully');
		} catch (error) {
			// console.error('Error during registration test:', error);
			throw new Error(`Registration test failed: ${error.message}`);
		}
	});

	test('POST /auth/login should succeed with valid credentials', async () => {
		try {
			await request(app).post('/auth/register').send({
				username: 'testuser2',
				email: 'test2@example.com',
				password: 'securepass',
			});

			const res = await request(app).post('/auth/login').send({
				username: 'testuser2',
				password: 'securepass',
			});

			// console.log('Login response:', res.headers['set-cookie'][0]);

			expect(res.statusCode).toBe(200);
			expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('token='));
			expect(res.body).toHaveProperty('message', 'User logged in successfully');
		} catch (error) {
			// console.error('Error during login test:', error);
			throw new Error(`Login test failed: ${error.message}`);
		}
	});

	test('POST using unimplemented endpoint should return 404', async () => {
		try {
			const res = await request(app).post('/unimplemented-endpoint').send({
				data: 'test',
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('error', 'Not Found');
		} catch (error) {
			// console.error('Error during unimplemented endpoint test:', error);
			throw new Error(`Unimplemented endpoint test failed: ${error.message}`);
		}
	});
});
