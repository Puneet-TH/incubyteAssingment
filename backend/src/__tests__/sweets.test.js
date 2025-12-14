const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const bcrypt = require('bcryptjs');

describe('Sweets API', () => {
  let authToken;
  let adminToken;
  let testSweetId;

  beforeAll(async () => {
    await connectDB();
    
    // Register and login as regular user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;

    // Create admin user directly in database
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });

    adminToken = adminLoginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up sweets collection before each test
    await Sweet.deleteMany({});
  });

  describe('GET /api/sweets', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
    });

    it('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all sweets', async () => {
      // Create a sweet
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10
      });

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Chocolate Bar');
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Candy',
          price: 1.99,
          quantity: 50
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Gummy Bears');
      expect(response.body.category).toBe('Candy');
      expect(response.body.price).toBe(1.99);
      expect(response.body.quantity).toBe(50);
      testSweetId = response.body._id;
    });

    it('should reject creation with invalid data', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          category: 'Candy',
          price: -1,
          quantity: -5
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10
      });
      await Sweet.create({
        name: 'Gummy Bears',
        category: 'Candy',
        price: 1.99,
        quantity: 20
      });
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Chocolate')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Chocolate Bar');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Candy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Candy');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=3')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(2);
        expect(sweet.price).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('PUT /api/sweets/:id', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.00,
        quantity: 5
      });
      testSweetId = sweet._id.toString();
    });

    it('should update a sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet',
          price: 2.50
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
      expect(response.body.price).toBe(2.50);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.00,
        quantity: 5
      });
      testSweetId = sweet._id.toString();
    });

    it('should delete a sweet (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sweet deleted successfully');
    });

    it('should reject deletion by non-admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.00,
        quantity: 10
      });
      testSweetId = sweet._id.toString();
    });

    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(7);
    });

    it('should reject purchase if insufficient quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 100
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient quantity in stock');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.00,
        quantity: 10
      });
      testSweetId = sweet._id.toString();
    });

    it('should restock a sweet (admin only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 5
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(15);
    });

    it('should reject restock by non-admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 5
        });

      expect(response.status).toBe(403);
    });
  });
});
