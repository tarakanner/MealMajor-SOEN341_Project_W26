import express from "express";
import { getGroceryPrices } from "../controllers/GroceryPriceController.js";

const router = express.Router();

router.post("/", getGroceryPrices);

export default router;
