import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import * as authService from "../services/authService";

jest.mock("../services/authService");

const mockedAuthService = jest.mocked(authService);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render LoginForm by default", () => {
    mockedAuthService.login.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign Up!/i)).toBeInTheDocument();
  });

  test("should display No account toggle text in login mode", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/No account?/i)).toBeInTheDocument();
  });

  test("should toggle to SignupForm when Sign Up button is clicked", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole("button", { name: /Sign Up!/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  test("should toggle back to LoginForm when Login button is clicked", () => {
    mockedAuthService.login.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    // First toggle to signup
    let toggleButton = screen.getByRole("button", { name: /Sign Up!/i });
    fireEvent.click(toggleButton);

    // Now toggle back to login
    toggleButton = screen.getByRole("button", { name: /Login!/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/No account?/i)).toBeInTheDocument();
  });

  test("should have Auth-Page class", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    expect(container.querySelector(".Auth-Page")).toBeInTheDocument();
  });
});
