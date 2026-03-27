import { jest } from '@jest/globals';
import { 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    getRecipes 
} from '../src/controllers/RecipeController.js';
import Recipe from '../src/models/Recipe.js';

describe('RecipeController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            query: { userId: 'mockUserId' },
            params: { id: 'mockRecipeId' },
            body: {
                userId: 'mockUserId',
                name: 'Delicious Pasta',
                ingredients: 'Pasta, Tomato Sauce',
                prepTime: '20 mins',
                steps: 'Boil pasta. Add sauce.',
                cost: '$5',
                difficulty: 'easy',
                dietaryTags: ['vegetarian']
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

    describe('createRecipe', () => {
        test('returns 400 if userId or name is missing', async () => {
            mockReq.body.userId = undefined;
            
            await createRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing required fields" });
        });

        test('returns 400 if difficulty is invalid', async () => {
            mockReq.body.difficulty = 'impossible';
            
            await createRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid difficulty level" });
        });

        test('saves new recipe and returns 201', async () => {
            const mockSave = jest.spyOn(Recipe.prototype, 'save').mockResolvedValue(true);

            await createRecipe(mockReq, mockRes);

            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'mockUserId',
                name: 'Delicious Pasta',
                difficulty: 'easy'
            }));
        });

        test('returns 500 on server error', async () => {
            jest.spyOn(Recipe.prototype, 'save').mockRejectedValue(new Error('DB Cluster Error'));

            await createRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('updateRecipe', () => {
        test('returns 400 if updating difficulty to an invalid level', async () => {
            mockReq.body.difficulty = 'super-hard';

            await updateRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid difficulty level" });
        });

        test('returns 404 if recipe to update is not found', async () => {
            jest.spyOn(Recipe, 'findByIdAndUpdate').mockResolvedValue(null);

            await updateRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Recipe not found" });
        });

        test('updates and returns 200 JSON payload with updated recipe', async () => {
            const mockUpdatedRecipe = { ...mockReq.body, name: 'Vegan Pasta' };
            jest.spyOn(Recipe, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedRecipe);

            await updateRecipe(mockReq, mockRes);

            // Verifies filtering bounds
            expect(Recipe.findByIdAndUpdate).toHaveBeenCalledWith(
                'mockRecipeId',
                expect.objectContaining({ name: 'Delicious Pasta' }),
                { new: true }
            );
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedRecipe);
        });

        test('returns 500 on update server error', async () => {
            jest.spyOn(Recipe, 'findByIdAndUpdate').mockRejectedValue(new Error('DB failure'));

            await updateRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('deleteRecipe', () => {
        test('returns 404 if recipe to delete is not found', async () => {
            jest.spyOn(Recipe, 'findByIdAndDelete').mockResolvedValue(null);

            await deleteRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Recipe not found" });
        });

        test('deletes recipe successfully returning 200 payload', async () => {
            jest.spyOn(Recipe, 'findByIdAndDelete').mockResolvedValue({ _id: 'mockRecipeId' });

            await deleteRecipe(mockReq, mockRes);

            expect(Recipe.findByIdAndDelete).toHaveBeenCalledWith('mockRecipeId');
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Recipe deleted successfully" });
        });

        test('returns 500 on deletion server error', async () => {
            jest.spyOn(Recipe, 'findByIdAndDelete').mockRejectedValue(new Error('DB failure'));

            await deleteRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    describe('getRecipes', () => {
        test('fetches recipes by userId', async () => {
            const mockRecipesList = [{ name: 'Vegan Pasta' }, { name: 'Pancakes' }];
            jest.spyOn(Recipe, 'find').mockResolvedValue(mockRecipesList);

            await getRecipes(mockReq, mockRes);

            expect(Recipe.find).toHaveBeenCalledWith({ userId: 'mockUserId' });
            expect(mockRes.json).toHaveBeenCalledWith(mockRecipesList);
        });

        test('fetches all recipes if userId is omitted', async () => {
            mockReq.query = {}; // no userId
            const mockRecipesList = [{ name: 'Global Recipe' }];
            jest.spyOn(Recipe, 'find').mockResolvedValue(mockRecipesList);

            await getRecipes(mockReq, mockRes);

            expect(Recipe.find).toHaveBeenCalledWith({});
            expect(mockRes.json).toHaveBeenCalledWith(mockRecipesList);
        });

        test('returns 500 on get server error', async () => {
            jest.spyOn(Recipe, 'find').mockRejectedValue(new Error('DB failure'));

            await getRecipes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });
});
