from flask import Flask, request
from totp import generate_otp
import pyotp

app = Flask(__name__)

otp_value = generate_otp()

@app.route("/verify", methods=["POST"])
def verify():
    data = request.json
    if data["otp"] == otp_value:
        return {"status": "success"}
    return {"status": "failed"}

if __name__ == "__main__":
    app.run(debug=True)
