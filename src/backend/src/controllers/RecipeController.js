import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
    try {
        const { userId, name, ingredients, prepTime, steps, cost, difficulty, dietaryTags } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (difficulty) {
            const validDifficulties = ["easy", "medium", "hard"];
            if (!validDifficulties.includes(difficulty)) {
                return res.status(400).json({ message: "Invalid difficulty level" });
            }
        }

        const newRecipe = new Recipe({
            userId,
            name,
            ingredients,
            prepTime,
            steps,
            cost,
            difficulty,
            dietaryTags,
        });
        await newRecipe.save();

        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const ALLOWED_FIELDS = ["name", "ingredients", "prepTime", "steps", "cost", "difficulty", "dietaryTags"];

export const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.difficulty) {
            const validDifficulties = ["easy", "medium", "hard"];
            if (!validDifficulties.includes(req.body.difficulty)) {
                return res.status(400).json({ message: "Invalid difficulty level" });
            }
        }

        const allowedUpdates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => ALLOWED_FIELDS.includes(key))
        );

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, allowedUpdates, { new: true });

        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(updatedRecipe);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        if (!deletedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getRecipes = async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        const recipes = await Recipe.find(filter);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

