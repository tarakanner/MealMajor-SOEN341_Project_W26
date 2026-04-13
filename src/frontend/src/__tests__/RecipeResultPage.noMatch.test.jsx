import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeResultPage from "../pages/RecipeResultPage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

/**
 * AT 6.2: No Recipes Match Selected Filters
 * Verify that the system shows a clear message when no recipes match
 * the selected filter criteria.
 */
describe("AT 6.2: No Recipes Match Selected Filters", () => {
  const mockRecipes = [
    {
      _id: "1",
      userId: "test-user-123",
      name: "Quick Vegan Bowl",
      ingredients: ["Rice", "Avocado", "Tofu"],
      prepTime: "15 mins",
      steps: ["Cook rice", "Slice avocado", "Combine"],
      cost: 8,
      difficulty: "Easy",
      dietaryTags: ["Vegan", "Gluten-Free"],
    },
    {
      _id: "2",
      userId: "test-user-123",
      name: "Classic Steak Dinner",
      ingredients: ["Steak", "Potatoes", "Butter"],
      prepTime: "1 hour 30 mins",
      steps: ["Season steak", "Grill", "Serve with potatoes"],
      cost: 28,
      difficulty: "Hard",
      dietaryTags: ["High-Protein"],
    },
    {
      _id: "3",
      userId: "test-user-123",
      name: "Simple Pasta",
      ingredients: ["Pasta", "Tomato Sauce", "Cheese"],
      prepTime: "20 mins",
      steps: ["Boil pasta", "Add sauce"],
      cost: 6,
      difficulty: "Easy",
      dietaryTags: ["Vegetarian"],
    },
    {
      _id: "4",
      userId: "test-user-123",
      name: "Gourmet Vegan Risotto",
      ingredients: ["Arborio Rice", "Mushrooms", "Vegetable Broth"],
      prepTime: "50 mins",
      steps: ["Toast rice", "Add broth gradually", "Stir in mushrooms"],
      cost: 18,
      difficulty: "Medium",
      dietaryTags: ["Vegan"],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === "userId") return "test-user-123";
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
   * AT 6.2 Steps 1-2: Navigate to Recipes section and confirm recipes load
   */
  test("AT 6.2 Steps 1-2: should display recipes before filtering", async () => {
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
    expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
    expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
    expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
  });

  /**
   * AT 6.2 Steps 3-4 & Expected Results:
   * Select filters (prepTime < 30 mins, difficulty Hard, dietary tag Gluten-Free)
   * that produce zero matching recipes, and verify "No recipes found" message.
   *
   * No recipe in the data set is simultaneously < 30 mins, Hard, AND Gluten-Free.
   */
  test("AT 6.2 Steps 3-4: should show 'No recipes found' when filters match nothing", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Step 3a: Select Preparation time < 30 minutes
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "lt30"); // Preparation Time

    // Step 3b: Select Difficulty Hard
    await user.selectOptions(selects[1], "Hard"); // Difficulty

    // Step 3c: Check Gluten-Free dietary tag
    const glutenFreeCheckbox = screen.getByRole("checkbox", { name: /gluten-free/i });
    await user.click(glutenFreeCheckbox);

    // Expected Result: No recipes displayed, "No recipes found" message shown
    await waitFor(() => {
      expect(screen.queryByText("Quick Vegan Bowl")).not.toBeInTheDocument();
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument();
      expect(screen.queryByText("Simple Pasta")).not.toBeInTheDocument();
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument();
      expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });
  });

  /**
   * Expected Result: The user can understand no recipes match and recover
   * by clearing filters to restore the full list.
   */
  test("Expected Result: user can clear filters to recover from no-match state", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Apply impossible filter combination
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "lt30"); // Prep time < 30
    await user.selectOptions(selects[1], "Hard"); // Difficulty Hard

    // Confirm no results
    await waitFor(() => {
      expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });

    // Click Clear Filters to reset
    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    await user.click(clearButton);

    // All recipes restored
    await waitFor(() => {
      expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
      expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
    });
  });

  /**
   * Expected Result: "No recipes found" message appears when a single
   * filter alone already excludes all recipes.
   */
  test("Expected Result: shows no-match message for a single impossible filter", async () => {
    const user = userEvent.setup();

    // Use a small set where no recipe has Dairy-Free tag
    const smallSet = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Cheese Pizza",
        ingredients: ["Dough", "Cheese", "Tomato Sauce"],
        prepTime: "25 mins",
        steps: ["Roll dough", "Add toppings", "Bake"],
        cost: 10,
        difficulty: "Easy",
        dietaryTags: ["Vegetarian"],
      },
    ];
    recipeService.getRecipes.mockResolvedValue(smallSet);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Cheese Pizza")).toBeInTheDocument();
    });

    // Apply a dietary tag that no recipe has
    const dairyFreeCheckbox = screen.getByRole("checkbox", { name: /dairy-free/i });
    await user.click(dairyFreeCheckbox);

    await waitFor(() => {
      expect(screen.queryByText("Cheese Pizza")).not.toBeInTheDocument();
      expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });
  });
});
