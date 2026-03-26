import mongoose from 'mongoose';

const mealEntrySchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    mealType: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
});

const weeklyMealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    meals: {
        type: [mealEntrySchema],
        default: [],
    },
});

export default mongoose.model('WeeklyMealPlan', weeklyMealPlanSchema);
