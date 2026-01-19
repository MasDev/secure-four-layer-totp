const express = require("express");
const bodyParser = require("body-parser");
const { generateOTP, verifyOTP } = require("./totp");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const USERS = [
  { username: "admin", password: "1234" },
  { username: "user", password: "user123" }
];

let currentOTP = "";

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Invalid username/password" });
  }

  // generate OTP
  currentOTP = generateOTP();
  console.log("Generated OTP:", currentOTP);

  return res.json({
    success: true,
    message: "OTP generated. Please enter the OTP.",
  });
});

app.post("/api/verify", (req, res) => {
  const { otp } = req.body;

  if (verifyOTP(otp) && otp === currentOTP) {
    currentOTP = "";
    return res.json({ success: true, message: "OTP verified. Login success." });
  }

  return res.json({ success: false, message: "Invalid OTP" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
