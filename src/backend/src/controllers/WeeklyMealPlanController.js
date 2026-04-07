import WeeklyMealPlan from "../models/WeeklyMealPlan.js";

const VALID_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const VALID_MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export const getMealPlan = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const mealPlan = await WeeklyMealPlan.findOne({ userId }).populate("meals.recipeId");

        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        res.json(mealPlan);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const addOrUpdateMeal = async (req, res) => {
    try {
        const { userId, day, mealType, recipeId } = req.body;

        if (!userId || !day || !mealType || !recipeId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!VALID_DAYS.includes(day)) {
            return res.status(400).json({ message: "Invalid day" });
        }

        if (!VALID_MEAL_TYPES.includes(mealType)) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        let mealPlan = await WeeklyMealPlan.findOne({ userId });

        if (!mealPlan) {
            mealPlan = new WeeklyMealPlan({ userId, meals: [{ day, mealType, recipeId }] });
            await mealPlan.save();
            return res.status(201).json(mealPlan);
        }

        const existingMeal = mealPlan.meals.find(
            (m) => m.day === day && m.mealType === mealType
        );

        if (existingMeal) {
            existingMeal.recipeId = recipeId;
        } else {
            mealPlan.meals.push({ day, mealType, recipeId });
        }

        await mealPlan.save();
        res.json(mealPlan);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { mealId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const mealPlan = await WeeklyMealPlan.findOne({ userId });

        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        const mealExists = mealPlan.meals.id(mealId);

        if (!mealExists) {
            return res.status(404).json({ message: "Meal not found" });
        }

        mealPlan.meals.pull({ _id: mealId });
        await mealPlan.save();

        res.json({ message: "Meal deleted successfully" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};
