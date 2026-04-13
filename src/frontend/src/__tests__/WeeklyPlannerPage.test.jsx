import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeeklyMealPlannerPage from "../pages/WeeklyPlannerPage";
import * as recipeService from "../services/recipeService";
import * as mealPlanService from "../services/mealPlanService";

// Mock the services
jest.mock("../services/recipeService");
jest.mock("../services/mealPlanService");

/**
 * AT 7.1: Assign Recipe to Weekly Meal Planner
 * Verify that a user can assign a recipe to a specific day and meal type
 * in the weekly meal planner and see it appear in the grid.
 */
describe("AT 7.1: Assign Recipe to Weekly Meal Planner", () => {
  const mockRecipes = [
    {
      _id: "recipe-1",
      id: "recipe-1",
      userId: "test-user-123",
      name: "Pasta Carbonara",
      ingredients: ["Pasta", "Eggs", "Bacon"],
      prepTime: "30 minutes",
      steps: ["Boil pasta", "Fry bacon", "Mix"],
      cost: 12.5,
      difficulty: "Medium",
      dietaryTags: [],
    },
    {
      _id: "recipe-2",
      id: "recipe-2",
      userId: "test-user-123",
      name: "Caesar Salad",
      ingredients: ["Lettuce", "Croutons", "Parmesan"],
      prepTime: "15 minutes",
      steps: ["Chop lettuce", "Mix ingredients"],
      cost: 8.0,
      difficulty: "Easy",
      dietaryTags: ["Vegetarian"],
    },
    {
      _id: "recipe-3",
      id: "recipe-3",
      userId: "test-user-123",
      name: "Grilled Chicken",
      ingredients: ["Chicken", "Spices", "Olive Oil"],
      prepTime: "45 minutes",
      steps: ["Season chicken", "Grill"],
      cost: 14.0,
      difficulty: "Medium",
      dietaryTags: ["High-Protein"],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === "userId") return "test-user-123";
        if (key === "preventDuplicates") return "false";
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  /**
   * AT 7.1 Steps 1-3: Navigate to Weekly Meal Planner and view weekly grid
   */
  test("AT 7.1 Steps 1-3: should display the weekly grid with days and meal types", async () => {
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(null);

    render(<WeeklyMealPlannerPage />);

    // Verify page title
    expect(screen.getByText("Weekly Meal Planner")).toBeInTheDocument();

    // Verify all days are displayed
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      expect(screen.getByText(day)).toBeInTheDocument();
    }

    // Verify all meal types are displayed
    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
    for (const type of mealTypes) {
      expect(screen.getByText(type)).toBeInTheDocument();
    }

    // Verify "Add meal" buttons are present in empty grid cells
    await waitFor(() => {
      const addButtons = screen.getAllByRole("button", { name: /add meal/i });
      expect(addButtons.length).toBe(28); // 7 days x 4 meal types
    });
  });

  /**
   * AT 7.1 Step 4: Select a grid cell (Monday Dinner), should open recipe list
   */
  test("AT 7.1 Step 4: should open recipe list when clicking a grid cell", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(null);

    render(<WeeklyMealPlannerPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /add meal/i }).length).toBe(28);
    });

    // Click the first "Add meal" button (Monday Breakfast)
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    await user.click(addButtons[0]);

    // Verify recipe selection modal opens with recipe choices
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
      expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    });
  });

  /**
   * AT 7.1 Steps 5-6 & Expected Results:
   * Choose a recipe from the list and assign it.
   * The selected recipe appears in the correct grid cell.
   * The weekly meal planner updates immediately.
   */
  test("AT 7.1 Steps 5-6: should assign recipe to the correct day and meal type", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(null);
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-1",
          day: "Monday",
          mealType: "dinner",
          recipeId: mockRecipes[0],
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /add meal/i }).length).toBe(28);
    });

    // Click the "Add meal" button for Monday Dinner
    // Grid layout: rows are meal types (Breakfast, Lunch, Dinner, Snack)
    // Each row has 7 day columns. Dinner is the 3rd row.
    // Monday Dinner = index: 2 * 7 = 14
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    await user.click(addButtons[14]); // Monday Dinner

    // Verify the modal header shows the correct day and meal type
    await waitFor(() => {
      expect(screen.getByText("Monday - Dinner")).toBeInTheDocument();
    });

    // Step 5-6: Select "Pasta Carbonara" from the recipe list
    const recipeButton = screen.getByRole("button", { name: "Pasta Carbonara" });
    await user.click(recipeButton);

    // Expected Result: The recipe appears in the grid cell
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Expected Result: The meal was assigned to the correct day and meal type
    expect(mealPlanService.addOrUpdateMeal).toHaveBeenCalledWith(
      "test-user-123",
      "Monday",
      "dinner",
      "recipe-1",
    );

    // Expected Result: The planner updates, cell now shows Edit/Delete instead of Add
    expect(screen.getAllByRole("button", { name: /add meal/i }).length).toBe(27); // one fewer
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  /**
   * Expected Result: The meal is assigned to the correct day and meal type
   * (Verify the API call parameters)
   */
  test("Expected Result: should call the API with correct day and meal type", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(null);
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-2",
          day: "Wednesday",
          mealType: "breakfast",
          recipeId: mockRecipes[1],
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /add meal/i }).length).toBe(28);
    });

    // Click Wednesday Breakfast: Breakfast row (index 0), Wednesday is day index 2
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    await user.click(addButtons[2]); // Wednesday Breakfast

    await waitFor(() => {
      expect(screen.getByText("Wednesday - Breakfast")).toBeInTheDocument();
    });

    // Select "Caesar Salad"
    const recipeButton = screen.getByRole("button", { name: "Caesar Salad" });
    await user.click(recipeButton);

    // Verify the API was called with correct parameters
    await waitFor(() => {
      expect(mealPlanService.addOrUpdateMeal).toHaveBeenCalledWith(
        "test-user-123",
        "Wednesday",
        "breakfast",
        "recipe-2",
      );
    });

    // Verify the recipe is now displayed in the grid
    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
  });

  /**
   * Expected Result: The recipe selection modal closes after assigning a meal
   */
  test("Expected Result: should close recipe selection after assigning a meal", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(null);
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-3",
          day: "Friday",
          mealType: "lunch",
          recipeId: mockRecipes[2],
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /add meal/i }).length).toBe(28);
    });

    // Click Friday Lunch: Lunch row (index 1), Friday is day index 4
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    await user.click(addButtons[11]); // Friday Lunch

    await waitFor(() => {
      expect(screen.getByText("Friday - Lunch")).toBeInTheDocument();
    });

    // Select "Grilled Chicken"
    const recipeButton = screen.getByRole("button", { name: "Grilled Chicken" });
    await user.click(recipeButton);

    // The modal header should disappear after selection
    await waitFor(() => {
      expect(screen.queryByText("Friday - Lunch")).not.toBeInTheDocument();
    });

    // The recipe appears in the grid
    expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
  });
});
