import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignUpForm";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Update mode based on URL params
  useEffect(() => {
    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [mode]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  // Don't render if user is authenticated
  if (user) {
    return null;
  }

  return (
    <>
      <div className="Auth-Page">
        {isLogin ? <LoginForm /> : <SignupForm />}

        <p>
          {isLogin ? "No account?" : "Already have an account?"}

          <br />
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up!" : "Login!"}
          </button>
        </p>
      </div>
    </>
  );
}
