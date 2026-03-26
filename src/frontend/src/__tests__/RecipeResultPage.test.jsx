import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeResultPage from "../pages/RecipeResultPage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

/**
 * AT 5.1: Search Recipes by Name or Ingredient
 * Verify that a user can search for recipes by name or ingredient and view matching results.
 */
describe("AT 5.1: Search Recipes by Name or Ingredient", () => {
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
   * AT 5.1 Step 1-3: Search by recipe name and display results
   */
  test("AT 5.1 Steps 1-3: should search recipes by name and display matching results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta Carbonara",
        ingredients: ["Pasta", "Eggs", "Bacon"],
        prepTime: "30 minutes",
        steps: ["Boil pasta", "Fry bacon"],
        cost: 12.5,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Caesar Salad",
        ingredients: ["Lettuce", "Croutons", "Parmesan"],
        prepTime: "15 minutes",
        steps: ["Chop lettuce", "Mix ingredients"],
        cost: 8.0,
        difficulty: "easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Spaghetti Bolognese",
        ingredients: ["Spaghetti", "Ground beef", "Tomato sauce"],
        prepTime: "45 minutes",
        steps: ["Brown meat", "Add sauce"],
        cost: 15.75,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Verify all recipes are initially displayed
    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();

    // Get the search input and search for Pasta
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Pasta");

    // Verify only matching recipes are displayed
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(screen.queryByText("Caesar Salad")).not.toBeInTheDocument();
      expect(screen.queryByText("Spaghetti Bolognese")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Search by ingredient
   */
  test("AT 5.1: should search recipes by ingredient and display matching results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta Carbonara",
        ingredients: ["Pasta", "Eggs", "Bacon"],
        prepTime: "30 minutes",
        steps: ["Boil pasta", "Fry bacon"],
        cost: 12.5,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Caesar Salad",
        ingredients: ["Lettuce", "Croutons", "Parmesan", "Eggs"],
        prepTime: "15 minutes",
        steps: ["Chop lettuce", "Mix ingredients"],
        cost: 8.0,
        difficulty: "easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Spaghetti Bolognese",
        ingredients: ["Spaghetti", "Ground beef", "Tomato sauce"],
        prepTime: "45 minutes",
        steps: ["Brown meat", "Add sauce"],
        cost: 15.75,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Search for recipes with Eggs ingredient
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Eggs");

    // Verify recipes with Eggs ingredient are displayed
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
      expect(screen.queryByText("Spaghetti Bolognese")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result 1: The system returns a list of recipes matching the search term
   */
  test("Expected Result 1: should return recipes matching the search term", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Chicken Stir Fry",
        ingredients: ["Chicken", "Bell Peppers", "Soy Sauce"],
        prepTime: "20 minutes",
        steps: ["Cut chicken", "Stir fry"],
        cost: 10.0,
        difficulty: "easy",
        dietaryTags: ["High-Protein"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Vegetable Stir Fry",
        ingredients: ["Broccoli", "Carrots", "Bell Peppers"],
        prepTime: "20 minutes",
        steps: ["Cut vegetables", "Stir fry"],
        cost: 7.5,
        difficulty: "easy",
        dietaryTags: ["Vegan"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Fish Tacos",
        ingredients: ["Fish", "Tortillas", "Cabbage"],
        prepTime: "30 minutes",
        steps: ["Cook fish", "Assemble tacos"],
        cost: 14.0,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
    });

    // Search for "Stir Fry"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Stir Fry");

    // Verify matching recipes are returned
    await waitFor(() => {
      expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
      expect(screen.getByText("Vegetable Stir Fry")).toBeInTheDocument();
      expect(screen.queryByText("Fish Tacos")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result 2: Search results are displayed clearly in the recipe list
   */
  test("Expected Result 2: should display search results clearly in the recipe list", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Chocolate Cake",
        ingredients: ["Flour", "Cocoa", "Eggs", "Sugar"],
        prepTime: "60 minutes",
        steps: ["Mix ingredients", "Bake"],
        cost: 9.99,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Vanilla Cake",
        ingredients: ["Flour", "Vanilla", "Eggs", "Sugar"],
        prepTime: "50 minutes",
        steps: ["Mix ingredients", "Bake"],
        cost: 8.99,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // Search for "Chocolate"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Chocolate");

    // Verify results are displayed in the recipe list/grid
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.queryByText("Vanilla Cake")).not.toBeInTheDocument();
    });

    // Verify the recipe card is visible in the results
    const recipeCards = screen.getAllByText("Chocolate Cake");
    expect(recipeCards.length).toBeGreaterThan(0);
  });

  /**
   * Expected Result 3: Each result shows relevant recipe information (e.g., name)
   */
  test("Expected Result 3: should display relevant recipe information in search results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Grilled Salmon",
        ingredients: ["Salmon", "Lemon", "Olive Oil"],
        prepTime: "25 minutes",
        steps: ["Season fish", "Grill"],
        cost: 18.5,
        difficulty: "medium",
        dietaryTags: ["High-Protein", "Gluten-Free"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Grilled Salmon")).toBeInTheDocument();
    });

    // Search for "Salmon"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Salmon");

    // Verify recipe information is displayed
    await waitFor(() => {
      expect(screen.getByText("Grilled Salmon")).toBeInTheDocument();
      expect(screen.getByText(/25 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/18.5/)).toBeInTheDocument();
      expect(screen.getByText(/medium/)).toBeInTheDocument();
      expect(screen.getByText(/High-Protein/)).toBeInTheDocument();
      expect(screen.getByText(/Gluten-Free/)).toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: No results found
   */
  test("AT 5.1: should display message when no recipes match the search", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta",
        ingredients: ["Pasta", "Tomato"],
        prepTime: "30 minutes",
        steps: ["Boil pasta"],
        cost: 5.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Pasta")).toBeInTheDocument();
    });

    // Search for something that doesn't match
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "NonExistentRecipe");

    // Verify no results message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/no recipes found/i)
      ).toBeInTheDocument();
      expect(screen.queryByText("Pasta")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Clear search to show all recipes
   */
  test("AT 5.1: should show all recipes when search is cleared", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pizza",
        ingredients: ["Dough", "Tomato", "Cheese"],
        prepTime: "40 minutes",
        steps: ["Make dough", "Add toppings", "Bake"],
        cost: 12.0,
        difficulty: "medium",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Burger",
        ingredients: ["Beef", "Bun", "Lettuce"],
        prepTime: "15 minutes",
        steps: ["Cook beef", "Assemble"],
        cost: 10.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    // Search for Pizza
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Pizza");

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.queryByText("Burger")).not.toBeInTheDocument();
    });

    // Clear the search
    await user.clear(searchInput);

    // Verify all recipes are shown again
    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Case-insensitive search
   */
  test("AT 5.1: should perform case-insensitive search", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Beef Tacos",
        ingredients: ["Beef", "Tortillas"],
        prepTime: "20 minutes",
        steps: ["Cook beef"],
        cost: 11.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });

    // Search with lowercase
    let searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "beef");

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });

    // Clear and search with uppercase
    await user.clear(searchInput);
    searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "BEEF");

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });
  });
});

/**
 * AT 5.2: View Recipe from Search Results and Handle No Results
 * Verify that a user can select a recipe from search results and that the system handles no-match scenarios correctly.
 */
describe("AT 5.2: View Recipe from Search Results and Handle No Results", () => {
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
   * AT 5.2 Step 4: Click on a recipe from search results
   */
  test("AT 5.2 Step 4: should open and display full recipe details when clicked", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Margherita Pizza",
        ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Basil"],
        preparationSteps: [
          "Prepare dough",
          "Add tomato sauce",
          "Add cheese",
          "Bake at 450F for 12 minutes",
        ],
        prepTime: "45 minutes",
        cost: 10.5,
        difficulty: "Easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Pepperoni Pizza",
        ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Pepperoni"],
        preparationSteps: [
          "Prepare dough",
          "Add tomato sauce",
          "Add cheese and pepperoni",
          "Bake at 450F for 12 minutes",
        ],
        prepTime: "45 minutes",
        cost: 12.0,
        difficulty: "Easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    });

    // Click on Margherita Pizza recipe card
    const pizzaCards = screen.getAllByText("Margherita Pizza");
    await user.click(pizzaCards[0]);

    // Wait for modal to display (look for the Basil ingredient which is unique to this recipe detail)
    await waitFor(() => {
      expect(screen.getByText(/Basil/)).toBeInTheDocument();
    });

    // Verify full recipe details are displayed in modal/overlay
    expect(screen.getAllByText("Margherita Pizza").length).toBeGreaterThan(1);
    expect(screen.getAllByText(/45 minutes/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/10.5/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Easy/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Vegetarian/).length).toBeGreaterThanOrEqual(1);

    // Verify ingredients are shown
    expect(screen.getByText(/Dough/)).toBeInTheDocument();
    expect(screen.getByText(/Tomato Sauce/)).toBeInTheDocument();
    expect(screen.getByText(/Mozzarella/)).toBeInTheDocument();
    expect(screen.getByText(/Basil/)).toBeInTheDocument();

    // Verify preparation steps are shown
    expect(screen.getByText(/Bake at 450F for 12 minutes/)).toBeInTheDocument();
  });

  /**
   * Expected Result 1: The selected recipe opens and displays full details
   */
  test("Expected Result 1: should display all recipe information when recipe is selected", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Thai Green Curry",
        ingredients: [
          "Chicken",
          "Green Curry Paste",
          "Coconut Milk",
          "Thai Basil",
          "Bell Peppers",
        ],
        preparationSteps: [
          "Sauté curry paste",
          "Add chicken",
          "Add coconut milk",
          "Simmer 15 minutes",
          "Add basil and peppers",
        ],
        prepTime: "30 minutes",
        cost: 14.75,
        difficulty: "Medium",
        dietaryTags: ["Gluten-Free", "High-Protein"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Thai Green Curry")).toBeInTheDocument();
    });

    // Click recipe
    const recipeCards = screen.getAllByText("Thai Green Curry");
    await user.click(recipeCards[0]);

    // Wait for modal to appear (look for unique ingredient)
    await waitFor(() => {
      expect(screen.getByText(/Green Curry Paste/)).toBeInTheDocument();
    });

    // Verify all details are displayed
    expect(screen.getAllByText("Thai Green Curry").length).toBeGreaterThan(1);
    expect(screen.getAllByText(/30 minutes/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/14.75/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Medium/i).length).toBeGreaterThanOrEqual(1);

    // Verify dietary tags
    expect(screen.getAllByText(/Gluten-Free/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/High-Protein/).length).toBeGreaterThan(0);

    // Verify ingredients section exists with all ingredients
    expect(screen.getByText(/Chicken/)).toBeInTheDocument();
    expect(screen.getByText(/Green Curry Paste/)).toBeInTheDocument();
    expect(screen.getByText(/Coconut Milk/)).toBeInTheDocument();
    expect(screen.getByText(/Thai Basil/)).toBeInTheDocument();
    expect(screen.getByText(/Bell Peppers/)).toBeInTheDocument();

    // Verify preparation steps section exists
    expect(screen.getByText(/Sauté curry paste/)).toBeInTheDocument();
    expect(screen.getByText(/Simmer 15 minutes/)).toBeInTheDocument();
  });

  /**
   * AT 5.2 Step 5-6: Search for term that matches no recipes and display no-match message
   */
  test("AT 5.2 Steps 5-6: should display 'No recipes found' message when search has no matches", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Sushi Rolls",
        ingredients: ["Rice", "Nori", "Salmon"],
        preparationSteps: ["Prepare rice", "Roll"],
        prepTime: "30 minutes",
        cost: 16.0,
        difficulty: "Medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Tempura",
        ingredients: ["Shrimp", "Vegetables", "Batter"],
        preparationSteps: ["Prepare batter", "Fry"],
        prepTime: "25 minutes",
        cost: 13.5,
        difficulty: "Medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for initial recipes to load
    await waitFor(() => {
      expect(screen.getByText("Sushi Rolls")).toBeInTheDocument();
    });

    // Search for nonexistent recipe
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Nonexistent Recipe 123");

    // Verify no results message is displayed
    await waitFor(() => {
      expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });

    // Verify recipe cards are not shown
    expect(screen.queryByText("Sushi Rolls")).not.toBeInTheDocument();
    expect(screen.queryByText("Tempura")).not.toBeInTheDocument();
  });

  /**
   * Expected Result 2: The system displays "No recipes found" message when there are no matches
   */
  test("Expected Result 2: should display user-friendly no-match message", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Lasagna",
        ingredients: ["Pasta", "Cheese", "Meat Sauce"],
        preparationSteps: ["Layer ingredients", "Bake"],
        prepTime: "90 minutes",
        cost: 15.0,
        difficulty: "Hard",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Lasagna")).toBeInTheDocument();
    });

    // Search for something with no match
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "xyz");

    // Verify the message is displayed
    await waitFor(() => {
      const noResultsMsg = screen.getByText(/no recipes found/i);
      expect(noResultsMsg).toBeInTheDocument();
      expect(noResultsMsg).toHaveTextContent(/try another search/i);
    });
  });

  /**
   * Expected Result 3: The UI remains stable and user-friendly in both scenarios
   */
  test("Expected Result 3: UI should remain stable when selecting recipe", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Grilled Chicken",
        ingredients: ["Chicken", "Lemon", "Garlic"],
        preparationSteps: ["Season", "Grill"],
        prepTime: "30 minutes",
        cost: 9.99,
        difficulty: "Easy",
        dietaryTags: ["High-Protein"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Roasted Vegetables",
        ingredients: ["Broccoli", "Carrots", "Olive Oil"],
        preparationSteps: ["Toss with oil", "Roast"],
        prepTime: "40 minutes",
        cost: 5.99,
        difficulty: "Easy",
        dietaryTags: ["Vegan"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
      expect(screen.getByText("Roasted Vegetables")).toBeInTheDocument();
    });

    // Click on first recipe
    const chickenCards = screen.getAllByText("Grilled Chicken");
    await user.click(chickenCards[0]);

    // Verify modal/overlay appears with no errors
    await waitFor(() => {
      expect(screen.getByText(/Lemon/)).toBeInTheDocument();
    });

    // Close the modal (click X button)
    const closeButton = screen.getByRole("button", { name: /x/i });
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    // Verify we're back to recipe grid
    await waitFor(() => {
      expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
      expect(screen.getByText("Roasted Vegetables")).toBeInTheDocument();
    });
  });

  /**
   * Should handle modal close by clicking outside (on overlay)
   */
  test("Expected Result 3: UI should close recipe detail when clicking outside", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta Aglio e Olio",
        ingredients: ["Pasta", "Garlic", "Olive Oil", "Red Chili"],
        preparationSteps: ["Boil pasta", "Sauté garlic and oil"],
        prepTime: "20 minutes",
        cost: 6.0,
        difficulty: "Easy",
        dietaryTags: ["Vegan"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Pasta Aglio e Olio")).toBeInTheDocument();
    });

    // Click on recipe card
    const recipeCards = screen.getAllByText("Pasta Aglio e Olio");
    await user.click(recipeCards[0]);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText(/Red Chili/)).toBeInTheDocument();
    });

    // Click on overlay background (the recipe-card-display div)
    // Get the overlay element and click it
    const recipeDetails = screen.getByText(/Sauté garlic and oil/);
    const overlay = recipeDetails.closest(".recipe-card-display");
    expect(overlay).toBeInTheDocument();

    // Click on the overlay but not on the card
    await user.click(overlay);

    // Verify modal has closed and we're back to list view
    await waitFor(() => {
      expect(screen.queryByText(/Red Chili/)).not.toBeInTheDocument();
    });
  });

  /**
   * Should transition smoothly between search with results and no results
   */
  test("Expected Result 3: UI should handle smooth transitions between results and no results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Tomato Soup",
        ingredients: ["Tomato", "Cream", "Basil"],
        preparationSteps: ["Cook tomatoes", "Blend", "Add cream"],
        prepTime: "25 minutes",
        cost: 7.5,
        difficulty: "Easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Minestrone",
        ingredients: ["Vegetables", "Pasta", "Broth"],
        preparationSteps: ["Chop vegetables", "Simmer"],
        prepTime: "35 minutes",
        cost: 8.0,
        difficulty: "Easy",
        dietaryTags: ["Vegan"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Initial state: both recipes visible
    await waitFor(() => {
      expect(screen.getByText("Tomato Soup")).toBeInTheDocument();
      expect(screen.getByText("Minestrone")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);

    // Search with results
    await user.type(searchInput, "Tomato");

    await waitFor(() => {
      expect(screen.getByText("Tomato Soup")).toBeInTheDocument();
      expect(screen.queryByText("Minestrone")).not.toBeInTheDocument();
    });

    // Search with no results
    await user.clear(searchInput);
    await user.type(searchInput, "InvalidRecipe");

    await waitFor(() => {
      expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
      expect(screen.queryByText("Tomato Soup")).not.toBeInTheDocument();
    });

    // Clear search back to all results
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText("Tomato Soup")).toBeInTheDocument();
      expect(screen.getByText("Minestrone")).toBeInTheDocument();
      expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
    });
  });

  /**
   * Should properly display recipe details with various data types
   */
  test("Should display recipe details correctly with edge case data", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Simple Dish",
        ingredients: ["Ingredient A", "Ingredient B"],
        preparationSteps: ["Step 1", "Step 2"],
        prepTime: "15 minutes",
        cost: 5,
        difficulty: "Easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Simple Dish")).toBeInTheDocument();
    });

    // Click to open
    const recipeCards = screen.getAllByText("Simple Dish");
    await user.click(recipeCards[0]);

    // Wait for modal to appear
    await waitFor(() => {
      // Look for the Ingredients section which only appears in the modal
      expect(screen.getByText(/Ingredients/)).toBeInTheDocument();
    });

    // Verify all details render correctly
    expect(screen.getAllByText("Simple Dish").length).toBeGreaterThan(1);
    // Verify the modal content is present by checking for section headers
    expect(screen.getByText(/Ingredients/)).toBeInTheDocument();
    expect(screen.getByText(/Preparation Steps/)).toBeInTheDocument();
    // Verify cost header is displayed
    expect(screen.getAllByText(/Cost:/).length).toBeGreaterThan(0);
    // Verify at least some content is shown
    expect(screen.getAllByText(/Ingredient A/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Step 1/).length).toBeGreaterThan(0);
  });
});
