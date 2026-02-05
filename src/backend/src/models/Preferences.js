import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    dietaryRestrictions: {
        type: [String],
        default: [],
    },
    allergies: {
        type: [String],
        default: [],
    },
    otherAllergy: {
        type: String,
        default: "",
    },
});

export default mongoose.model('Preference', preferenceSchema);