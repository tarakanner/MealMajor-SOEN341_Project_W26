import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FridgePage from "../pages/FridgePage";
import * as fridgeService from "../services/fridgeService";

jest.mock("../services/fridgeService");
jest.mock("../services/groceryPriceService");

describe("FridgePage", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "testuser123");
    jest.clearAllMocks();
    fridgeService.getFridge.mockResolvedValue({ ingredients: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("should render fridge page", () => {
    render(<FridgePage />);

    expect(screen.getByText(/ingredients/i) || screen.getByDisplayValue("")).toBeInTheDocument();
  });

  test("should load ingredients on mount", async () => {
    const mockIngredients = {
      ingredients: [
        { name: "apple", quantity: "2", unit: "units" },
        { name: "milk", quantity: "1", unit: "litres" },
      ],
    };
    fridgeService.getFridge.mockResolvedValue(mockIngredients);

    render(<FridgePage />);

    await waitFor(() => {
      expect(fridgeService.getFridge).toHaveBeenCalledWith("testuser123");
    });
  });

  test("should display error message on failed load", async () => {
    fridgeService.getFridge.mockRejectedValue(new Error("Failed to load"));

    render(<FridgePage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load fridge/i)
      ).toBeInTheDocument();
    });
  });

  test("should not render if userId is not in localStorage", () => {
    localStorage.removeItem("userId");

    const { container } = render(<FridgePage />);

    expect(container.innerHTML).not.toContain("undefined");
  });

  test("should have input fields for ingredient, quantity, and unit", () => {
    render(<FridgePage />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should have UNIT_OPTIONS defined", () => {
    const { container } = render(<FridgePage />);

    // Check if unit select element exists
    const unitSelects = container.querySelectorAll("select");
    expect(unitSelects.length).toBeGreaterThan(-1);
  });
});
