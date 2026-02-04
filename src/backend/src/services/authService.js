// PLACEHOLDER backend endpoints for frontend testing
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 3000; // backend port (keep 5173 for Vite frontend)
const SECRET = "secret"; // placeholder secret (move to .env later)

// Issue a token (placeholder login)
app.post("/api/token", (req, res) => {
  const { email, password } = req.body;

  // Placeholder check (replace later)
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  const payload = { email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// Verify token
app.get("/api/verify", (req, res) => {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" "); // "Bearer <token>"
  const token = parts.length === 2 ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return res.status(200).json({ data: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Placeholder backend running on http://localhost:${PORT}`);
});
