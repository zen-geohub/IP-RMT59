// server/controllers/user.controller.test.js
const request = require('supertest');
const UserController = require('../controllers/user.controller');
const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

jest.mock('../models');
jest.mock('../helpers/bcrypt');
jest.mock('../helpers/jwt');
jest.mock('google-auth-library');

describe('UserController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('googleLogin', () => {
    it('should login successfully with valid Google token', async () => {
      const mockPayload = {
        email: 'test@example.com',
        given_name: 'Test',
        family_name: 'User',
        picture: 'http://example.com/picture.jpg',
      };
      const mockToken = 'mockToken';
      const mockUser = { id: 1, ...mockPayload };

      mockReq.body.token = mockToken;
      const mockClient = { verifyIdToken: jest.fn().mockResolvedValue({ getPayload: () => mockPayload }) };
      OAuth2Client.mockImplementation(() => mockClient);
      User.findOrCreate.mockResolvedValue([mockUser, true]);
      generateToken.mockReturnValue('mockAccessToken');

      await UserController.googleLogin(mockReq, mockRes, mockNext);

      expect(mockClient.verifyIdToken).toHaveBeenCalledWith({
        idToken: mockToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(User.findOrCreate).toHaveBeenCalledWith({
        where: { email: mockPayload.email },
        defaults: expect.any(Object),
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        access_token: 'mockAccessToken',
        firstName: mockPayload.given_name,
        lastName: mockPayload.family_name,
        profilePicture: mockPayload.picture,
      });
    });

    it('should handle errors during Google login', async () => {
      mockReq.body.token = 'invalidToken';
      const mockClient = { verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')) };
      OAuth2Client.mockImplementation(() => mockClient);

      await UserController.googleLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      mockReq.body = { email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User' };
      User.create.mockResolvedValue({ get: jest.fn().mockReturnValue(mockUser) });

      await UserController.register(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors during registration', async () => {
      User.create.mockRejectedValue(new Error('Validation error'));

      await UserController.register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        profilePicture: 'http://example.com/picture.jpg',
      };
      mockReq.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(true);
      generateToken.mockReturnValue('mockAccessToken');

      await UserController.login(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockReq.body.email } });
      expect(comparePassword).toHaveBeenCalledWith(mockReq.body.password, mockUser.password);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        access_token: 'mockAccessToken',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        profilePicture: mockUser.profilePicture,
      });
    });

    it('should handle missing email or password', async () => {
      mockReq.body = { password: 'password' };

      await UserController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        name: 'BadRequest',
        message: 'Email is required.',
      });
    });

    it('should handle invalid credentials', async () => {
      mockReq.body = { email: 'test@example.com', password: 'wrongPassword' };
      User.findOne.mockResolvedValue(null);

      await UserController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        name: 'Unauthorized',
        message: 'Email or password is incorrect',
      });
    });
  });
});