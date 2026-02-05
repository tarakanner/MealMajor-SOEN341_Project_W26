import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ email, password });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", userId: newUser._id});
    }catch (err) {
        return res.status(500).json({ message: "server error" });
    }
}

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: "1d" } );

        // Return success response
        return res.status(200).json({ message: "Login successful", userId: user._id, token });

    }catch(err){
        return res.status(500).json({ message: "server error" })
    }
}