import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "../components/SignUpForm";
import * as authService from "../services/authService";

// Mock signup
jest.spyOn(authService, "signup").mockResolvedValue({});

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows success message after successful signup", async () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText(/retype password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith(
        "test@email.com",
        "password123",
        "testuser"
      );

      expect(
        screen.getByText(/account created successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error if passwords do not match", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText(/retype password/i), {
      target: { value: "wrong" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      screen.getByText(/passwords do not match/i)
    ).toBeInTheDocument();

    expect(authService.signup).not.toHaveBeenCalled();
  });

  test("shows error if password is less than 6 characters", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText(/retype password/i), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    expect(authService.signup).not.toHaveBeenCalled();
  });

  test("shows error message on signup failure", async () => {
    authService.signup.mockRejectedValueOnce(new Error("Email already exists"));

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/retype password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/signup failed: email already exists/i)).toBeInTheDocument();
    });
  });
});