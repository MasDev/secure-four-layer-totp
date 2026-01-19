const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { generateOTP, verifyOTP } = require("./totp");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const USERS = [
  { username: "admin", password: "1234" },
  { username: "user", password: "user123" }
];

let currentOTP = "";
let usedOTPs = new Set();

// ===================
// Layer 1: Rate Limiter
// ===================
const attempts = {};

function rateLimiter(ip) {
  const now = Date.now();
  if (!attempts[ip]) attempts[ip] = [];
  attempts[ip] = attempts[ip].filter(t => now - t < 5 * 60 * 1000); // last 5 minutes

  if (attempts[ip].length >= 3) {
    return false;
  }
  attempts[ip].push(now);
  return true;
}

// ===================
// LOGIN
// ===================
app.post("/api/login", (req, res) => {
  const ip = req.ip;
  const { username, password } = req.body;

  // Layer 1 check
  if (!rateLimiter(ip)) {
    return res.json({
      success: false,
      layer: "Layer 1",
      message: "Rate limit exceeded. Try again after 5 minutes."
    });
  }

  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.json({
      success: false,
      layer: "Layer 1",
      message: "Invalid username/password"
    });
  }

  // Generate OTP
  currentOTP = generateOTP();
  console.log("Generated OTP:", currentOTP);

  return res.json({
    success: true,
    layer: "Layer 1",
    message: "OTP generated. Enter OTP.",
    otp: currentOTP  // ONLY for testing/demo
  });
});

// ===================
// VERIFY
// ===================
app.post("/api/verify", (req, res) => {
  const { otp, layerStatus } = req.body;

  // Layer 4: TOTP Verification + Replay prevention
  if (usedOTPs.has(otp)) {
    return res.json({
      success: false,
      layer: "Layer 4",
      message: "OTP already used (Replay detected)."
    });
  }

  if (!verifyOTP(otp) || otp !== currentOTP) {
    return res.json({
      success: false,
      layer: "Layer 4",
      message: "Invalid OTP."
    });
  }

  usedOTPs.add(otp);
  currentOTP = "";

  // Save report
  const report = `
  ===== LOGIN REPORT =====
  Layer 1: Rate Limiter -> PASSED
  Layer 2: Keystroke Analyser -> ${layerStatus.layer2}
  Layer 3: Temporal Validator -> ${layerStatus.layer3}
  Layer 4: TOTP Verifier -> PASSED
  =========================
  `;

  fs.writeFileSync(`./public/report_${Date.now()}.txt`, report);

  return res.json({
    success: true,
    message: "Login success",
    reportFile: `report_${Date.now()}.txt`
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
