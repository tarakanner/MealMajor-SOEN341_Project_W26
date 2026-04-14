import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import request from "supertest";
import app from "../../app";
import GroceryList from "../components/GroceryList";

jest.mock("../api/groceryList", () => ({ generateGroceryList: jest.fn() }));
jest.mock("../models/Fridge", () => ({ findOne: jest.fn() }));
jest.mock("../models/MealPlan", () => ({ findOne: jest.fn() }));

const { generateGroceryList } = require("../api/groceryList");
const Fridge = require("../models/Fridge");
const MealPlan = require("../models/MealPlan");

const FRIDGE = ["eggs", "milk", "rice"];
const MEALS = [
  { day: "Monday",  type: "lunch",  ingredients: ["eggs", "flour", "butter"] },
  { day: "Tuesday", type: "dinner", ingredients: ["rice", "chicken", "soy sauce"] },
];
const MISSING = ["flour", "butter", "chicken", "soy sauce"];

beforeEach(() => jest.clearAllMocks());

// ── Frontend ── //
describe("AT 8.1 Frontend", () => {

  // Step 4: Save fridge ingredients → Step 7: Click Generate Grocery List
  test("generates and displays missing ingredients after clicking Generate Grocery List", async () => {
    generateGroceryList.mockResolvedValue({
      missingIngredients: MISSING,
      message: "Grocery list generated successfully",
    });
    render(<GroceryList />);

    fireEvent.click(screen.getByRole("button", { name: /save fridge ingredients/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate grocery list/i }));

    // Missing ingredients are displayed
    await waitFor(() => {
      MISSING.forEach((item) => expect(screen.getByText(new RegExp(item, "i"))).toBeInTheDocument());
    });

    // Fridge items are NOT in the list
    FRIDGE.forEach((item) => expect(screen.queryByText(new RegExp(`^${item}$`, "i"))).not.toBeInTheDocument());

    // Confirmation message shown
    expect(screen.getByText(/grocery list generated successfully/i)).toBeInTheDocument();
  });

  // No missing ingredients case
  test("shows 'No missing ingredients' when fridge covers all meal ingredients", async () => {
    generateGroceryList.mockResolvedValue({ missingIngredients: [], message: "Grocery list generated successfully" });
    render(<GroceryList />);

    fireEvent.click(screen.getByRole("button", { name: /generate grocery list/i }));

    await waitFor(() => expect(screen.getByText(/no missing ingredients/i)).toBeInTheDocument());
  });
});

// ── Backend ── //
describe("AT 8.1 Backend: POST /api/grocery-list/generate", () => {

  // Steps 3–7: fridge has eggs/milk/rice, meals need flour/butter/chicken/soy sauce
  test("returns only missing ingredients and a success message", async () => {
    Fridge.findOne.mockResolvedValue({ userId: "user123", ingredients: FRIDGE });
    MealPlan.findOne.mockResolvedValue({ userId: "user123", meals: MEALS });

    const res = await request(app)
      .post("/api/grocery-list/generate")
      .send({ userId: "user123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.missingIngredients).toEqual(expect.arrayContaining(MISSING));
    FRIDGE.forEach((item) => expect(res.body.missingIngredients).not.toContain(item));
    expect(res.body.message).toMatch(/grocery list generated successfully/i);
  });

  // Empty list case
  test("returns empty list when all meal ingredients are already in the fridge", async () => {
    Fridge.findOne.mockResolvedValue({ userId: "user123", ingredients: ["eggs", "rice"] });
    MealPlan.findOne.mockResolvedValue({ userId: "user123", meals: [{ day: "Monday", type: "lunch", ingredients: ["eggs", "rice"] }] });

    const res = await request(app)
      .post("/api/grocery-list/generate")
      .send({ userId: "user123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.missingIngredients).toHaveLength(0);
  });
});