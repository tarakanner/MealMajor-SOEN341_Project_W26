import express from "express";
import { createRecipe, updateRecipe, deleteRecipe, getRecipes } from "../controllers/RecipeController.js";

const router = express.Router();

router.get("/", getRecipes);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;