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
 * AT 7.2: Edit and Remove Weekly Meal Planner Recipe
 * Verify that a user can edit or remove an assigned recipe and that the
 * system prevents duplicate assignments.
 */
describe("AT 7.2: Edit and Remove Weekly Meal Planner Recipe", () => {
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

  // Pre-populated meal plan with Monday Dinner assigned
  const existingMealPlan = {
    meals: [
      {
        _id: "meal-1",
        day: "Monday",
        mealType: "dinner",
        recipeId: {
          _id: "recipe-1",
          id: "recipe-1",
          name: "Pasta Carbonara",
          ingredients: ["Pasta", "Eggs", "Bacon"],
          prepTime: "30 minutes",
          cost: 12.5,
          difficulty: "Medium",
          dietaryTags: [],
        },
      },
    ],
  };

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
   * AT 7.2 Steps 1-3: Navigate to planner and see existing assigned recipe
   */
  test("AT 7.2 Steps 1-3: should display existing recipe in the grid cell", async () => {
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);

    render(<WeeklyMealPlannerPage />);

    // The assigned recipe should appear in the grid
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Cell with a recipe shows Edit and Delete buttons
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  /**
   * AT 7.2 Steps 4-5: Click Edit and choose a different recipe
   * Expected Result: The updated recipe appears in the correct grid cell
   */
  test("AT 7.2 Steps 4-5: should edit an assigned recipe to a different one", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-1",
          day: "Monday",
          mealType: "dinner",
          recipeId: mockRecipes[1], // Caesar Salad
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    // Wait for existing recipe to load
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Step 4: Click Edit on the assigned cell
    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Recipe selection modal opens
    await waitFor(() => {
      expect(screen.getByText("Monday - Dinner")).toBeInTheDocument();
    });

    // Step 5: Choose a different recipe
    const newRecipeButton = screen.getByRole("button", { name: "Caesar Salad" });
    await user.click(newRecipeButton);

    // Expected Result: The updated recipe appears in the grid
    await waitFor(() => {
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    });

    // API was called with the correct parameters
    expect(mealPlanService.addOrUpdateMeal).toHaveBeenCalledWith(
      "test-user-123",
      "Monday",
      "dinner",
      "recipe-2",
    );
  });

  /**
   * AT 7.2 Step 6: Remove an assigned recipe
   * Expected Result: The removed meal disappears from the planner
   */
  test("AT 7.2 Step 6: should remove an assigned recipe from the planner", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);
    mealPlanService.deleteMeal.mockResolvedValue({ success: true });

    render(<WeeklyMealPlannerPage />);

    // Wait for existing recipe
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Click Delete on the assigned cell
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    // Expected Result: The meal disappears from the planner
    await waitFor(() => {
      expect(screen.queryByText("Pasta Carbonara")).not.toBeInTheDocument();
    });

    // The API was called to delete the meal
    expect(mealPlanService.deleteMeal).toHaveBeenCalledWith(
      "test-user-123",
      "meal-1",
    );

    // The cell now shows "Add meal" again
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    expect(addButtons.length).toBe(28); // all cells are empty now
  });

  /**
   * Expected Result: The weekly planner updates immediately after edit
   */
  test("Expected Result: planner updates immediately after editing a recipe", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-1",
          day: "Monday",
          mealType: "dinner",
          recipeId: mockRecipes[2], // Grilled Chicken
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Edit to Grilled Chicken
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await waitFor(() => {
      expect(screen.getByText("Monday - Dinner")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "Grilled Chicken" }));

    // Planner updates immediately: old recipe gone, new one visible
    await waitFor(() => {
      expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    });

    // Modal closes after selection
    expect(screen.queryByText("Monday - Dinner")).not.toBeInTheDocument();

    // Edit and Delete buttons still present for the updated cell
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  /**
   * AT 7.2 Step 7 & Expected Result: System prevents duplicate meal assignments
   * Trying to add a recipe to a cell that already has one shows a warning.
   */
  test("AT 7.2 Step 7: should prevent adding to a cell that already has a recipe", async () => {
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);

    render(<WeeklyMealPlannerPage />);

    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Find the "Add meal" buttons, there should be 27 (one cell is occupied)
    const addButtons = screen.getAllByRole("button", { name: /add meal/i });
    expect(addButtons.length).toBe(27);
  });

  /**
   * Expected Result: After removal, the cell can be reassigned a new recipe
   */
  test("Expected Result: can assign a new recipe after removing the old one", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);
    mealPlanService.getMealPlan.mockResolvedValue(existingMealPlan);
    mealPlanService.deleteMeal.mockResolvedValue({ success: true });
    mealPlanService.addOrUpdateMeal.mockResolvedValue({
      meals: [
        {
          _id: "meal-2",
          day: "Monday",
          mealType: "dinner",
          recipeId: mockRecipes[2], // Grilled Chicken
        },
      ],
    });

    render(<WeeklyMealPlannerPage />);

    // Wait for existing recipe
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Remove the existing recipe
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(screen.queryByText("Pasta Carbonara")).not.toBeInTheDocument();
    });

    // All 28 cells now show "Add meal"
    let addButtons = screen.getAllByRole("button", { name: /add meal/i });
    expect(addButtons.length).toBe(28);

    // Re-assign a new recipe to the same cell (Monday Dinner = index 14)
    await user.click(addButtons[14]); // Monday Dinner

    await waitFor(() => {
      expect(screen.getByText("Monday - Dinner")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Grilled Chicken" }));

    // The new recipe appears in the grid
    await waitFor(() => {
      expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    });

    expect(mealPlanService.addOrUpdateMeal).toHaveBeenCalledWith(
      "test-user-123",
      "Monday",
      "dinner",
      "recipe-3",
    );
  });
});
