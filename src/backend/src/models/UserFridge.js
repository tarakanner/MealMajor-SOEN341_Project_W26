import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
});

const userFridgeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    ingredients: {
        type: [ingredientSchema],
        default: [],
    },
});

export default mongoose.model('UserFridge', userFridgeSchema);
