import express from "express";
import connectDB from "./config/mongodb.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import weeklyMealPlanRoutes from "./routes/weeklyMealPlanRoutes.js";
import fridgeRoutes from "./routes/fridgeRoutes.js";
import groceryPriceRoutes from "./routes/groceryPriceRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plan", weeklyMealPlanRoutes);
app.use("/api/fridge", fridgeRoutes);
app.use("/api/grocery-prices", groceryPriceRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
