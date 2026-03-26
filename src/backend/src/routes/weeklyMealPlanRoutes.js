import express from "express";
import { getMealPlan, addOrUpdateMeal, deleteMeal } from "../controllers/WeeklyMealPlanController.js";

const router = express.Router();

router.get("/", getMealPlan);
router.post("/", addOrUpdateMeal);
router.delete("/:mealId", deleteMeal);

export default router;
