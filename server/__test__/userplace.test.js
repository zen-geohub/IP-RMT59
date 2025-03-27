// server/controllers/userplaces.controller.test.js
const { UserPlace, Place } = require('../models');
const UserPlacesController = require('../controllers/userplaces.controller');

jest.mock('../models');

describe('UserPlacesController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, user: { id: 1 } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserPlace', () => {
    it('should create a user place successfully', async () => {
      const mockPlace = { id: 1 };
      const mockUserPlace = { id: 1, PlaceId: 1, UserId: 1 };
      mockReq.body = {
        properties: { placeId: '123', displayName: 'Test Place' },
        geometry: { coordinates: [100, 200] },
      };

      Place.findOrCreate.mockResolvedValue([mockPlace, true]);
      UserPlace.findOrCreate.mockResolvedValue([mockUserPlace, true]);

      await UserPlacesController.createUserPlace(mockReq, mockRes, mockNext);

      expect(Place.findOrCreate).toHaveBeenCalledWith({
        where: { 'properties.placeId': '123' },
        defaults: expect.any(Object),
      });
      expect(UserPlace.findOrCreate).toHaveBeenCalledWith({
        where: { PlaceId: 1, UserId: 1 },
        defaults: { PlaceId: 1, UserId: 1 },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserPlace);
    });

    it('should handle errors during creation', async () => {
      const mockError = { name: 'BadRequest', message: 'Properties and geometry are required.' };
      mockReq.body = {};
    
      await UserPlacesController.createUserPlace(mockReq, mockRes, mockNext);
    
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('readUserPlaces', () => {
    it('should retrieve user places successfully', async () => {
      const mockUserPlaces = [{ id: 1, Place: { id: 1, displayName: 'Test Place' } }];
      UserPlace.findAll.mockResolvedValue(mockUserPlaces);

      await UserPlacesController.readUserPlaces(mockReq, mockRes, mockNext);

      expect(UserPlace.findAll).toHaveBeenCalledWith({
        where: { UserId: 1 },
        include: [{ model: Place }],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserPlaces);
    });

    it('should handle errors during retrieval', async () => {
      const mockError = new Error('Database error');
      UserPlace.findAll.mockRejectedValue(mockError);

      await UserPlacesController.readUserPlaces(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateUserPlace', () => {
    it('should update a user place successfully', async () => {
      const mockUpdatedUserPlace = [{ id: 1, notes: 'Updated notes' }];
      mockReq.params.id = 1;
      mockReq.body.notes = 'Updated notes';

      UserPlace.update.mockResolvedValue([1, [mockUpdatedUserPlace]]);

      await UserPlacesController.updateUserPlace(mockReq, mockRes, mockNext);

      expect(UserPlace.update).toHaveBeenCalledWith(
        { notes: 'Updated notes' },
        { where: { id: 1 }, returning: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedUserPlace);
    });

    it('should handle errors during update', async () => {
      const mockError = { name: 'BadRequest', message: 'Notes are required.' };
      mockReq.params.id = 1;
      mockReq.body = {};
    
      await UserPlacesController.updateUserPlace(mockReq, mockRes, mockNext);
    
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteUserPlace', () => {
    it('should delete a user place successfully', async () => {
      mockReq.params.id = 1;

      UserPlace.destroy.mockResolvedValue(1);

      await UserPlacesController.deleteUserPlace(mockReq, mockRes, mockNext);

      expect(UserPlace.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Place has been removed from your list.' });
    });

    it('should handle errors during deletion', async () => {
      const mockError = new Error('Database error');
      UserPlace.destroy.mockRejectedValue(mockError);

      await UserPlacesController.deleteUserPlace(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});