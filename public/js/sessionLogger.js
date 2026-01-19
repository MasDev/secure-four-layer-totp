const fs = require("fs");
const path = require("path");

module.exports = function logSession(data) {
  const file = path.join(
    __dirname,
    `../reports/login-report-${Date.now()}.txt`
  );

  const report = `
LOGIN SESSION REPORT
=====================
Time: ${new Date().toISOString()}

Layer 1 (Rate Limiter): ${data.layer1}
Layer 2 (Keystroke Biometrics): ${data.layer2}
Layer 3 (Temporal Validator): ${data.layer3}
Layer 4 (TOTP Verification): ${data.layer4}

Attempts: ${data.attempts}
Result: ${data.result}

Security Gaps Covered:
- Brute force
- Bot typing
- Replay attacks
- Timing abuse
`;

  fs.writeFileSync(file, report);
};
