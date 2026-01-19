import pyotp

secret = pyotp.random_base32()
totp = pyotp.TOTP(secret)

def generate_otp():
    otp = totp.now()
    print("ONE TIME OTP:", otp)
    return otp
