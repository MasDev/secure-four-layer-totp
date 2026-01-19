import pyotp

secret = pyotp.random_base32()
totp = pyotp.TOTP(secret)

def generate_otp():
    otp = totp.now()
    print("ONE TIME OTP:", otp)
    return otp

const { totp } = require("otplib");

const SECRET = "JBSWY3DPEHPK3PXP";

function verifyOTP(code) {
  return totp.check(code, SECRET);
}

module.exports = { verifyOTP };
