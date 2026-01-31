//for Backend: Please note that email regex verification won't be done here and will have to be implemented in the backend

import {useState} from "react";
import {signup} from "../services/authService";

export default function SignupForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        //this will be replaced later with the REAL backend function for Signing-in
        signup(email,password)
    };

    return(
        <>
        <form onSubmit={handleSubmit}className="auth-form" >
            <h1>Sign Up!</h1>
            <input
                 type="email"
                placeholder="Email"
                value= {email}
                onChange= {(e)=> setEmail(e.target.value)}
                //avoids user submitting with missing info
                required
            >
            </input>
            <input
                 type="password"
                placeholder="Password"
                value= {password}
                onChange= {(e)=> setPassword(e.target.value)}
                //avoids user submitting with missing info
                required
            >
            </input>

            <button type="submit">Create Account!</button>
        </form>
        </>
    );
}