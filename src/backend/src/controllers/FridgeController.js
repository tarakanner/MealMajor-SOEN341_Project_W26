import UserFridge from "../models/UserFridge.js";
import WeeklyMealPlan from "../models/WeeklyMealPlan.js";

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

const UNITS = new Set([
    'g', 'kg', 'mg', 'ml', 'l', 'oz', 'lb', 'lbs',
    'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons',
    'teaspoon', 'teaspoons', 'bunch', 'bunches', 'clove', 'cloves',
    'slice', 'slices', 'piece', 'pieces', 'can', 'cans',
    'bag', 'bags', 'bottle', 'bottles', 'pinch', 'dash',
    'head', 'heads', 'stalk', 'stalks', 'sprig', 'sprigs',
]);

function parseIngredientName(raw) {
    let s = raw.trim().toLowerCase();
    // remove leading fraction (e.g. "1/2")
    s = s.replace(/^\d+\s*\/\s*\d+/, '');
    // remove leading integer or decimal number (may be attached to a unit like "250g")
    s = s.replace(/^\d+(\.\d+)?/, '');
    s = s.trim();
    // remove a leading unit word if present (e.g. "g", "cup", "tbsp")
    const words = s.split(/\s+/);
    if (words.length > 1 && UNITS.has(words[0])) {
        words.shift();
    }
    return words.join(' ').trim();
}

export const getMissingIngredients = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const mealPlan = await WeeklyMealPlan.findOne({ userId }).populate("meals.recipeId");

        if (!mealPlan || mealPlan.meals.length === 0) {
            return res.json({ missingIngredients: [] });
        }

        const planIngredients = new Set();
        for (const meal of mealPlan.meals) {
            if (meal.recipeId && meal.recipeId.ingredients) {
                for (const ing of meal.recipeId.ingredients) {
                    const parsed = parseIngredientName(ing);
                    if (parsed) planIngredients.add(parsed);
                }
            }
        }

        const fridge = await UserFridge.findOne({ userId });
        const fridgeNames = fridge
            ? fridge.ingredients.map(i => i.name.trim().toLowerCase())
            : [];

        const missingIngredients = [...planIngredients].filter(planIng =>
            !fridgeNames.some(fridgeName =>
                planIng.includes(fridgeName) || fridgeName.includes(planIng)
            )
        );

        res.json({ missingIngredients });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
