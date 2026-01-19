const otpStore = {};

function generateOTP(user) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[user] = otp;
  return otp;
}

function verifyOTP(user, otp) {
  return otpStore[user] == otp;
}

module.exports = { generateOTP, verifyOTP };
