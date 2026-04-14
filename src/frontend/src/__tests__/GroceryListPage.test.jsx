import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import GroceryListPage from "../pages/GroceryListPage";
import * as fridgeService from "../services/fridgeService";

jest.mock("../services/fridgeService");
jest.mock("../services/groceryService");
jest.mock("../components/GroceryListResult", () => {
  return function MockComponent() {
    return <div>Mock Grocery List Result</div>;
  };
});

describe("GroceryListPage", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "testuser123");
    jest.clearAllMocks();
    fridgeService.getMissingIngredients.mockResolvedValue({
      missingIngredients: [],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("should render grocery list page", async () => {
    fridgeService.getMissingIngredients.mockResolvedValue({
      missingIngredients: ["eggs", "milk"],
    });

    render(<GroceryListPage />);

    await waitFor(() => {
      expect(screen.getByText(/Missing Ingredients:/i)).toBeInTheDocument();
      expect(screen.getByText(/eggs, milk/i)).toBeInTheDocument();
    });
  });

  test("should load missing ingredients on mount", async () => {
    fridgeService.getMissingIngredients.mockResolvedValue({
      missingIngredients: ["eggs", "milk"],
    });

    render(<GroceryListPage />);

    await waitFor(() => {
      expect(fridgeService.getMissingIngredients).toHaveBeenCalledWith(
        "testuser123"
      );
    });
  });

  test("should handle error when loading missing ingredients fails", async () => {
    fridgeService.getMissingIngredients.mockRejectedValue(
      new Error("Load failed")
    );

    render(<GroceryListPage />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load missing ingredients/i)).toBeInTheDocument();
    });
  });

  test("should set loaded state after loading ingredients", async () => {
    fridgeService.getMissingIngredients.mockResolvedValue({
      missingIngredients: [],
    });

    render(<GroceryListPage />);

    await waitFor(() => {
      expect(fridgeService.getMissingIngredients).toHaveBeenCalled();
    });
  });

  test("should not load if userId is not available", async () => {
    localStorage.removeItem("userId");

    render(<GroceryListPage />);

    await waitFor(() => {
      expect(screen.getByText(/Go to your Fridge/i)).toBeInTheDocument();
    });
  });
});
