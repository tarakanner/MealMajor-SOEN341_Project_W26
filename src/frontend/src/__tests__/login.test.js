import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import * as authService from "../services/authService";

// Mock login service
jest.spyOn(authService, "login").mockResolvedValue({});

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("LoginForm", () => {
    test("logs in successfully and redirects to userpage", async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), {
            target: { value: "testuser" },
        });

        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: "test@email.com" },
        });

        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith(
                "test@email.com",
                "password123",
                "testuser"
            );
            expect(mockNavigate).toHaveBeenCalledWith("/userpage");
        });
    });
});