const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const PORT = 3000;
const SECRET = "secret";

// TEMP in-memory users store (replace with DB later)
const users = new Map(); // key: email, value: { id, email, passwordHash }

let nextId = 1;

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Validate
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "password must be at least 8 chars" });
    }

    // 2) Check exists
    if (users.has(email)) {
      return res.status(409).json({ message: "email already registered" });
    }

    // 3) Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4) Save user
    const user = { id: nextId++, email, passwordHash };
    users.set(email, user);

    // 5) (Optional) Return token to auto-login
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "signup success",
      token,
      user: { id: user.id, email: user.email }, // never return passwordHash
    });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});
