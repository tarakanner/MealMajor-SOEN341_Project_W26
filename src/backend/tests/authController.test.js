import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login } from '../src/controllers/authController.js';
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

describe('AuthController - login', () => {
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
    
    await login(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Email and password are required" });
  });

  test('returns 400 if user email is not found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid email" });
  });

  test('returns 400 if password does not match', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ 
      email: 'test@example.com', 
      password: 'hashedpassword' 
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await login(mockReq, mockRes);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid password" });
  });

  test('returns 200 and a token on successful login', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ 
      _id: 'mockUserId',
      email: 'test@example.com',
      userName: 'testuser',
      password: 'hashedpassword' 
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mocked.jwt.token');

    await login(mockReq, mockRes);

    expect(jwt.sign).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Login successful",
      userId: 'mockUserId',
      userName: 'testuser',
      token: 'mocked.jwt.token'
    });
  });

  test('returns 500 on server error', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database cluster failed'));

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "server error" });
  });
});
