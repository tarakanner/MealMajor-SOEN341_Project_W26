import express from "express";
import { getFridge, saveIngredients } from "../controllers/FridgeController.js";

const router = express.Router();

router.get("/", getFridge);
router.post("/", saveIngredients);

export default router;
