import Preferences from "../models/Preferences.js";

export const getPreferences = async (req, res) => {
    try {
        const preferences = await Preferences.findOne({ userId: req.query.userId });
        if (!preferences) {
            return res.status(404).json({ message: "Preferences not found" });
        }
        res.json(preferences);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const validateOtherField = (other) => {
    if (!other || other.trim() === "") {
        return true;
    }
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(other.trim());
};

export const createPreferences = async (req, res) => {
    try {
        const { userId, dietaryRestrictions, allergies, otherAllergy } = req.body;
        if (!validateOtherField(otherAllergy)) {
            return res.status(400).json({ message: "Invalid input in 'otherAllergy' field" });
        }

        let trimmedOtherAllergy = "";
        if (otherAllergy) {
            trimmedOtherAllergy = otherAllergy.trim();
        }

        const newPreferences = new Preferences({
            userId,
            dietaryRestrictions,
            allergies,
            otherAllergy: trimmedOtherAllergy,
        });
        await newPreferences.save();
        res.status(201).json(newPreferences);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const { userId, dietaryRestrictions, allergies, otherAllergy } = req.body;
        if (!validateOtherField(otherAllergy)) {
            return res.status(400).json({ message: "Invalid input in 'otherAllergy' field" });
        }

        let trimmedOtherAllergy = "";
        if (otherAllergy) {
            trimmedOtherAllergy = otherAllergy.trim();
        }

        const updatedPreferences = await Preferences.findOneAndUpdate(
            { userId },
            { 
                dietaryRestrictions, 
                allergies, 
                otherAllergy: trimmedOtherAllergy 
            },
            { new: true }
        );
        res.json({message: "Preferences updated", preferences: updatedPreferences});
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deletePreferences = async (req, res) => {
    try {
        await Preferences.findOneAndDelete({ userId: req.query.userId });
        res.json({ message: "Preferences deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};