const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const rateLimiter = require("./rateLimiter");
const { generateOTP, verifyOTP } = require("./otp");
const users = require("./users.json");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
  secret: "secure-secret",
  resave: false,
  saveUninitialized: true
}));

app.post("/login", rateLimiter, (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const otp = generateOTP(username);
  req.session.tempUser = username;
  console.log("OTP:", otp);

  res.json({ message: "OTP generated. Check terminal." });
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (!req.session.tempUser) return res.status(403).json({ message: "Session expired" });

  if (verifyOTP(req.session.tempUser, otp)) {
    req.session.authenticated = true;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
