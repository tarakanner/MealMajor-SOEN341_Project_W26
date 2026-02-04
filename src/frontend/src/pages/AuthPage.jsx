import {useState} from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignUpForm";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
        <div className="Auth-Page">
            {isLogin ? <LoginForm/> : <SignupForm/>}
            
            <p>
                {isLogin ? "No account?" : "Already have an account?"}
            
            <br/>
                <button onClick={()=> setIsLogin(!isLogin)}>
                   {isLogin ? "Sign Up!" : "Login!"}
                </button>
            </p>
        </div>
        </>
    );
}