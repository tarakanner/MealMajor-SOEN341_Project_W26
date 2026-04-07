import express from "express";
import { getFridge, saveIngredients, getMissingIngredients } from "../controllers/FridgeController.js";

const router = express.Router();

router.get("/missing-ingredients", getMissingIngredients);
router.get("/", getFridge);
router.post("/", saveIngredients);

export default router;
