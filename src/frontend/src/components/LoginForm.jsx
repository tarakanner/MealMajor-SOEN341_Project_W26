//for Backend: Please note that verification of existing user won't be done here but in the backend


import {useState} from "react";
import {login} from "../../../backend/src/services/authService";

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        //this will be replaced later with the REAL backend function for Logging-in
        login(email,password)
    };

    return(
        <>
        <form onSubmit={handleSubmit} className="auth-form">
            <h1>Login</h1>
            <input
            //the type will KIND OF solve the email verification part, but either way is safer to doublecheck in the backend
                 type="email"
                placeholder="Email"
                value= {email}
                onChange= {(e)=> setEmail(e.target.value)}
                //avoids user submitting with missing info
                required
            >
            </input>
            <input
            //makes it not visible
                 type="password"
                placeholder="Password"
                value= {password}
                onChange= {(e)=> setPassword(e.target.value)}
                //avoids user submitting with missing info
                required
            >
            </input>

            <button type="submit">Login :-)</button>
        </form>
        </>
    );
}