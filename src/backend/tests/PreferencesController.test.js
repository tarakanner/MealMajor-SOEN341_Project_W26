import { jest } from '@jest/globals';
import { 
    getPreferences, 
    createPreferences, 
    updatePreferences 
} from '../src/controllers/PreferencesController.js';
import Preferences from '../src/models/Preferences.js';

describe('PreferencesController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            query: { userId: 'mockUserId' },
            body: {
                userId: 'mockUserId',
                dietaryRestrictions: ['vegan'],
                allergies: ['Peanuts'],
                otherAllergy: 'Soy'
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

    describe('getPreferences', () => {
        test('returns 404 if preferences not found', async () => {
            jest.spyOn(Preferences, 'findOne').mockResolvedValue(null);

            await getPreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Preferences not found" });
        });

        test('returns 200 with preferences if found', async () => {
            const mockPrefs = { dietaryRestrictions: ['vegan'] };
            jest.spyOn(Preferences, 'findOne').mockResolvedValue(mockPrefs);

            await getPreferences(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockPrefs);
        });

        test('returns 500 on server error', async () => {
            jest.spyOn(Preferences, 'findOne').mockRejectedValue(new Error('DB failure'));

            await getPreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('createPreferences', () => {
        test('returns 400 if otherAllergy is invalid', async () => {
            mockReq.body.otherAllergy = 'Invalid123!';
            
            await createPreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid input in 'otherAllergy' field" });
        });

        test('saves new preferences and returns 201', async () => {
            const mockSave = jest.spyOn(Preferences.prototype, 'save').mockResolvedValue(true);

            await createPreferences(mockReq, mockRes);

            expect(mockSave).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'mockUserId',
                dietaryRestrictions: ['vegan'],
                allergies: ['Peanuts'],
                otherAllergy: 'Soy'
            }));
        });

        test('returns 500 on server error', async () => {
            jest.spyOn(Preferences.prototype, 'save').mockRejectedValue(new Error('DB error'));

            await createPreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updatePreferences', () => {
        test('returns 400 if otherAllergy is invalid', async () => {
            mockReq.body.otherAllergy = 'Bad@Allergy';

            await updatePreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        test('updates and returns 200 on success', async () => {
            const mockUpdatedPrefs = { dietaryRestrictions: ['vegan', 'kosher'] };
            jest.spyOn(Preferences, 'findOneAndUpdate').mockResolvedValue(mockUpdatedPrefs);

            await updatePreferences(mockReq, mockRes);

            expect(Preferences.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: 'mockUserId' },
                { dietaryRestrictions: ['vegan'], allergies: ['Peanuts'], otherAllergy: 'Soy' },
                { new: true }
            );
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Preferences updated",
                preferences: mockUpdatedPrefs
            });
        });

        test('returns 500 on server error', async () => {
            jest.spyOn(Preferences, 'findOneAndUpdate').mockRejectedValue(new Error('DB error'));

            await updatePreferences(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
});
