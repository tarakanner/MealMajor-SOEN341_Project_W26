import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        default: [],
    },
    prepTime: {
        type: String,
        default: '',
    },
    steps: {
        type: [String],
        default: [],
    },
    cost: {
        type: Number,
        default: 0,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    dietaryTags: {
        type: [String],
        default: [],
    },
});

export default mongoose.model('Recipe', recipeSchema);
