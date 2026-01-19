const usedOtps = new Set();

function addUsedOtp(otp) {
  usedOtps.add(otp);
}

function isUsed(otp) {
  return usedOtps.has(otp);
}

module.exports = { addUsedOtp, isUsed };
