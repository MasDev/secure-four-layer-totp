const fs = require("fs");
const path = require("path");

module.exports = function logSession(data) {
  const reportsDir = path.join(__dirname, "../reports");

  // Create reports folder if missing
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const filePath = path.join(
    reportsDir,
    `login-report-${Date.now()}.txt`
  );

  const report = `
==============================
 FOUR-LAYER LOGIN REPORT
==============================

Time: ${new Date().toISOString()}

Layer 1 – Rate Limiter: ${data.layer1}
Layer 2 – Keystroke Biometrics: ${data.layer2}
Layer 3 – Temporal Validator: ${data.layer3}
Layer 4 – TOTP Core Verifier: ${data.layer4}

Login Attempts: ${data.attempts}
Final Result: ${data.result}

Security Gaps Covered:
- Brute-force attack mitigation
- Automated bot input detection
- Timing-based abuse prevention
- Replay attack resistance

==============================
 End of Report
==============================
`;

  fs.writeFileSync(filePath, report, "utf8");
};
