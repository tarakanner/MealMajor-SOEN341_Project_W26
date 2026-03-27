import { jest } from '@jest/globals';
import { register } from '../src/controllers/authController.js';
import User from '../src/models/User.js';

describe('AuthController - register', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        userName: 'testuser'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns 400 if email or password is missing', async () => {
    mockReq.body.password = undefined;
    
    await register(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Email and password are required" });
  });

  test('returns 400 if user already exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'test@example.com', userName: 'testuser' });

    await register(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com', userName: 'testuser' });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Email already registered" });
  });

  test('creates new user and returns 201 on success', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const mockSave = jest.spyOn(User.prototype, 'save').mockResolvedValue(true);

    await register(mockReq, mockRes);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      userId: expect.anything(),
      userName: 'testuser'
    });
  });

  test('returns 500 on server error', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database cluster failed'));

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "server error" });
  });
});
