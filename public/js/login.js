function generateOTP() {
  // Layer 1 – Rate limiting (simulated)
  document.getElementById("l1").innerText = "PASS";

  // Layer 2 – Keystroke biometrics (simulated)
  document.getElementById("l2").innerText = "PASS";

  fetch("http://localhost:3000/api/generate-otp", {
    method: "POST",
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("l3").innerText = "PASS";
        alert("OTP generated (check server console)");
      }
    });
}

function login() {
  const otp = document.getElementById("otp").value;

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        document.getElementById("l4").innerText = "FAIL";
        document.getElementById("result").innerText =
          "❌ Login failed at Layer 4 (OTP)";
        return;
      }

      document.getElementById("l4").innerText = "PASS";
      document.getElementById("result").innerText =
        "✅ All 4 layers passed. Login successful!";
      window.location.href = "home.html";
    });
}
