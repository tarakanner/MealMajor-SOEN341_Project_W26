import UserFridge from "../models/UserFridge.js";

export const getFridge = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const fridge = await UserFridge.findOne({ userId });

        if (!fridge) {
            return res.status(404).json({ message: "Fridge not found" });
        }

        res.json(fridge);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const saveIngredients = async (req, res) => {
    try {
        const { userId, ingredients } = req.body;

        if (!userId || !ingredients) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let fridge = await UserFridge.findOne({ userId });

        if (!fridge) {
            fridge = new UserFridge({ userId, ingredients });
            await fridge.save();
            return res.status(201).json(fridge);
        }

        fridge.ingredients = ingredients;
        await fridge.save();
        res.json(fridge);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
