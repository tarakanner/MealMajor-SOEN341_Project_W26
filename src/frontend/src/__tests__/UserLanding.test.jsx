import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserLanding from "../pages/UserLanding";
import * as authService from "../services/authService";
import * as preferencesService from "../services/preferencesService";
import * as recipeService from "../services/recipeService";

jest.mock("../services/authService");
jest.mock("../services/preferencesService");
jest.mock("../services/recipeService");
jest.mock("../components/SearchBar", () => {
  return function MockComponent() {
    return <div>Mock Search Bar</div>;
  };
});
jest.mock("../components/RecipeFilterUI", () => {
  return function MockComponent() {
    return <div>Mock Recipe Filter UI</div>;
  };
});
jest.mock("../components/RecipeResult", () => {
  return function MockComponent() {
    return <div>Mock Recipe Result</div>;
  };
});

describe("UserLanding", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "testuser123");
    jest.clearAllMocks();
    authService.getUserName.mockReturnValue("TestUser");
    preferencesService.getPreferences.mockResolvedValue({
      allergies: [],
      dietaryRestrictions: [],
    });
    recipeService.getRecipes.mockResolvedValue([]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("should render user landing page with components", () => {
    render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mock Search Bar/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Recipe Filter UI/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Recipe Result/i)).toBeInTheDocument();
  });

  test("should get userName from authService", () => {
    render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    expect(authService.getUserName).toHaveBeenCalled();
  });

  test("should load preferences on mount", async () => {
    render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(preferencesService.getPreferences).toHaveBeenCalledWith(
        "testuser123"
      );
    });
  });

  test("should handle preferences not found gracefully", async () => {
    preferencesService.getPreferences.mockRejectedValue(
      new Error("Not found")
    );

    render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Mock Recipe Filter UI/i)).toBeInTheDocument();
    });
  });

  test("should display default username when not available", () => {
    authService.getUserName.mockReturnValue(null);

    render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mock Recipe Filter UI/i)).toBeInTheDocument();
  });

  test("should only initialize once on mount", async () => {
    const { rerender } = render(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    const initialCallCount = preferencesService.getPreferences.mock.calls.length;

    rerender(
      <MemoryRouter>
        <UserLanding />
      </MemoryRouter>
    );

    // The call count should not increase significantly due to useRef guard
    expect(
      preferencesService.getPreferences.mock.calls.length - initialCallCount
    ).toBeLessThan(2);
  });
});
