let layer2Status = "NOT RUN";
let layer3Status = "NOT RUN";

const btnLogin = document.getElementById("btnLogin");
const btnVerify = document.getElementById("btnVerify");

btnLogin.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  document.getElementById("layer1").innerText = `${data.layer}: ${data.message}`;
  document.getElementById("layer2").innerText = "Layer 2: Pending (Keystroke not captured yet)";
  document.getElementById("layer3").innerText = "Layer 3: Pending (Timing not captured yet)";
  document.getElementById("layer4").innerText = "Layer 4: Pending";

  if (data.success) {
    alert("OTP Generated! Check console or response");
  }
});

let keystrokes = [];
let startTime = 0;

const otpInput = document.getElementById("otp");

otpInput.addEventListener("focus", () => {
  keystrokes = [];
  startTime = Date.now();
});

otpInput.addEventListener("keydown", (e) => {
  keystrokes.push({ time: Date.now(), key: e.key });
});

btnVerify.addEventListener("click", async () => {
  const otp = otpInput.value;

  // Layer 2: Keystroke Analyzer
  const intervals = [];
  for (let i = 1; i < keystrokes.length; i++) {
    intervals.push(keystrokes[i].time - keystrokes[i - 1].time);
  }

  let anomaly = false;
  intervals.forEach((i) => {
    if (i < 20) anomaly = true;  // too fast (bot)
  });

  layer2Status = anomaly ? "FAILED (bot-like typing)" : "PASSED";

  // Layer 3: Temporal Validator
  const totalDuration = Date.now() - startTime;
  let invalid = false;

  intervals.forEach((i) => {
    if (i > 5000) invalid = true; // too slow
  });

  if (totalDuration > 15000) invalid = true;

  layer3Status = invalid ? "FAILED (time violation)" : "PASSED";

  document.getElementById("layer2").innerText = `Layer 2: ${layer2Status}`;
  document.getElementById("layer3").innerText = `Layer 3: ${layer3Status}`;

  if (layer2Status.includes("FAILED")) {
    return alert("Layer 2 failed. You are blocked.");
  }
  if (layer3Status.includes("FAILED")) {
    return alert("Layer 3 failed. You are blocked.");
  }

  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      otp,
      layerStatus: {
        layer2: layer2Status,
        layer3: layer3Status
      }
    })
  });

  const data = await res.json();

  document.getElementById("layer4").innerText = `${data.layer}: ${data.message}`;

  if (data.success) {
    window.location.href = "/home.html";
  }
});
