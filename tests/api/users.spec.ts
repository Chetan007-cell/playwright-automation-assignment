import { test, expect } from '@playwright/test';

const BASE_API_URL = 'https://reqres.in/api';
const API_KEY = 'free_user_3JUnjlon1gmizY9kK9ggPhku8tq';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

test.describe('Part 2 — API Automation (ReqRes)', () => {
  test('6. GET /api/users?page=2 — verify status 200, data array, and user attributes (id, email, first_name, last_name)', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users?page=2`, { headers });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    for (const user of body.data) {
      expect(user).toHaveProperty('id');
      expect(typeof user.id).toBe('number');

      expect(user).toHaveProperty('email');
      expect(typeof user.email).toBe('string');
      expect(user.email.length).toBeGreaterThan(0);

      expect(user).toHaveProperty('first_name');
      expect(typeof user.first_name).toBe('string');
      expect(user.first_name.length).toBeGreaterThan(0);

      expect(user).toHaveProperty('last_name');
      expect(typeof user.last_name).toBe('string');
      expect(user.last_name.length).toBeGreaterThan(0);
    }
  });

  test('7. POST /api/users with { "name": "morpheus", "job": "leader" } — verify status 201, echoed name & job, id, and createdAt', async ({ request }) => {
    const payload = {
      name: 'morpheus',
      job: 'leader',
    };

    const response = await request.post(`${BASE_API_URL}/users`, {
      headers,
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);

    expect(body).toHaveProperty('id');
    expect(String(body.id).trim().length).toBeGreaterThan(0);

    expect(body).toHaveProperty('createdAt');
    expect(typeof body.createdAt).toBe('string');
    expect(Date.parse(body.createdAt)).not.toBeNaN();
  });

  test('8. Bonus: Chain the POST with follow-up assertion to demonstrate create-then-verify flow', async ({ request }) => {
    // Structure of create-then-verify flow:
    // Step 1: POST to create resource
    const newUserData = {
      name: 'morpheus',
      job: 'leader',
    };

    const createResponse = await request.post(`${BASE_API_URL}/users`, {
      headers,
      data: newUserData,
    });

    expect(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();

    // Step 2: Follow-up assertions chaining off POST response
    // (Note: ReqRes is a mock API and does not persist created entities for a subsequent GET /users/:id.
    // In an API with persistence, we would follow up with:
    //   const getResponse = await request.get(`${BASE_API_URL}/users/${createdUser.id}`);
    //   expect(getResponse.status()).toBe(200);
    // Here we verify that the created entity contract and attributes match expectations.)
    expect(createdUser).toMatchObject({
      name: newUserData.name,
      job: newUserData.job,
    });
    expect(createdUser.id).toBeDefined();
    expect(String(createdUser.id).length).toBeGreaterThan(0);
    expect(Date.parse(createdUser.createdAt)).not.toBeNaN();
  });
});
