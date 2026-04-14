import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeResultPage from "../pages/RecipeResultPage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

/**
 * AT 6.1: Filter Recipes by Multiple Criteria
 * Verify that a user can filter recipes by preparation time, difficulty,
 * cost, and dietary tags and view only matching recipes.
 */
describe("AT 6.1: Filter Recipes by Multiple Criteria", () => {
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
    {
      _id: "5",
      userId: "test-user-123",
      name: "Quick Smoothie",
      ingredients: ["Banana", "Almond Milk", "Spinach"],
      prepTime: "5 mins",
      steps: ["Blend all ingredients"],
      cost: 4,
      difficulty: "Easy",
      dietaryTags: ["Vegan", "Gluten-Free", "Dairy-Free"],
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
   * AT 6.1 Steps 1-2: Navigate to Recipes section and see all recipes
   */
  test("AT 6.1 Steps 1-2: should display all recipes before any filters are applied", async () => {
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
    expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
    expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
    expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
  });

  /**
   * AT 6.1 Step 3a: Select filter — Preparation time < 30 minutes
   */
  test("AT 6.1 Step 3a: should filter recipes by preparation time < 30 minutes", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Select "Less than 30 mins" from the Preparation Time dropdown
    const selects = screen.getAllByRole("combobox");
    const prepTimeSelect = selects[0]; // Preparation Time
    await user.selectOptions(prepTimeSelect, "lt30");

    // Only recipes with prepTime < 30 mins should be visible
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();     // 15 mins
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();          // 20 mins
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();        // 5 mins
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument(); // 1h30
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument(); // 50 mins
    });
  });

  /**
   * AT 6.1 Step 3b: Select filter — Difficulty Easy
   */
  test("AT 6.1 Step 3b: should filter recipes by difficulty Easy", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Select "Easy" from the Difficulty dropdown
    const selects = screen.getAllByRole("combobox");
    const difficultySelect = selects[1]; // Difficulty
    await user.selectOptions(difficultySelect, "Easy");

    // Only Easy recipes should be visible
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument();
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 6.1 Step 3c: Select filter — Dietary tag Vegan
   */
  test("AT 6.1 Step 3c: should filter recipes by Vegan dietary tag", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Check the Vegan checkbox
    const veganCheckbox = screen.getByRole("checkbox", { name: /vegan/i });
    await user.click(veganCheckbox);

    // Only Vegan recipes should be visible
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument();
      expect(screen.queryByText("Simple Pasta")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 6.1 Step 4 & Expected Result:
   * Apply combined filters (prepTime < 30 mins + Easy + Vegan)
   * Multiple filters work together to narrow results.
   */
  test("AT 6.1 Step 4: should apply multiple filters together to narrow results", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Apply prep time filter: < 30 mins
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "lt30"); // Preparation Time

    // Apply difficulty filter: Easy
    await user.selectOptions(selects[1], "Easy"); // Difficulty

    // Apply dietary tag filter: Vegan
    const veganCheckbox = screen.getByRole("checkbox", { name: /vegan/i });
    await user.click(veganCheckbox);

    // Only recipes matching ALL criteria should be visible:
    // Quick Vegan Bowl: 15 mins, Easy, Vegan ✓
    // Quick Smoothie: 5 mins, Easy, Vegan ✓
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument();
      expect(screen.queryByText("Simple Pasta")).not.toBeInTheDocument();
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result: Recipes that do not match the filters are hidden
   */
  test("Expected Result: non-matching recipes are hidden after filtering", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
    });

    // Apply cost filter: Under $10
    const selects = screen.getAllByRole("combobox");
    const costSelect = selects[2]; // Cost
    await user.selectOptions(costSelect, "under10");

    // Cheap recipes visible, expensive ones hidden
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();       // $8
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();            // $6
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();          // $4
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument(); // $28
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument(); // $18
    });
  });

  /**
   * Expected Result: The recipe list updates dynamically after applying filters
   * (Verify that adding then removing a filter restores recipes)
   */
  test("Expected Result: recipe list updates dynamically when filters change", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Apply Hard difficulty filter, should only have Classic Steak Dinner
    const selects = screen.getAllByRole("combobox");
    const difficultySelect = selects[1]; // Difficulty
    await user.selectOptions(difficultySelect, "Hard");

    await waitFor(() => {
      expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
      expect(screen.queryByText("Quick Vegan Bowl")).not.toBeInTheDocument();
    });

    // Clear filter by selecting "Any", all recipes should be there
    await user.selectOptions(difficultySelect, "");

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
      expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
    });
  });

  /**
   * Expected Result: Clear Filters button resets all filters and shows all recipes
   */
  test("Expected Result: Clear Filters restores all recipes", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
    });

    // Apply multiple filters
    const selects = screen.getAllByRole("combobox");
    const difficultySelect = selects[1]; // Difficulty
    await user.selectOptions(difficultySelect, "Easy");

    const veganCheckbox = screen.getByRole("checkbox", { name: /vegan/i });
    await user.click(veganCheckbox);

    // Verify narrowed results
    await waitFor(() => {
      expect(screen.queryByText("Classic Steak Dinner")).not.toBeInTheDocument();
      expect(screen.queryByText("Gourmet Vegan Risotto")).not.toBeInTheDocument();
    });

    // Click Clear Filters
    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    await user.click(clearButton);

    // All recipes restored
    await waitFor(() => {
      expect(screen.getByText("Quick Vegan Bowl")).toBeInTheDocument();
      expect(screen.getByText("Classic Steak Dinner")).toBeInTheDocument();
      expect(screen.getByText("Simple Pasta")).toBeInTheDocument();
      expect(screen.getByText("Gourmet Vegan Risotto")).toBeInTheDocument();
      expect(screen.getByText("Quick Smoothie")).toBeInTheDocument();
    });
  });
});
