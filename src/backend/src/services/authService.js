//these are PLACEHOLDER functions for testing the frontend
//Please keep these until the new and functional backend functions are made, and then we can implement them
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
app.use(express.json()); // to be able to parse incoming json in req bodies
const SECRET = "secret"; // secret key to sign in tokens and verify them.
// it must be the same for both "sign" and "verify"
// we need it to make sure the token was created by OUR SERVER

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  const payload = { email }; // only put email to be encoded and sent as a jwt but NEVER put password its not encrypted
  const token = jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// call this on login
app.post("/api/token", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  // the payload will be used to create a sign in token
  const payload = { email }; // define payload with email
  const token = jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });
  // sends json back to frontend
  res.json({ token });
});

// we call this on page refreshes or app startup to check if token is still valid
app.get("/api/verify", (req, res) => {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
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
  console.log(`Server is running on port ${PORT}`);
});
