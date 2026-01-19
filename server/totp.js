const crypto = require("crypto");

const SECRET = "JBSWY3DPEHPK3PXP"; // base32 secret

function base32ToHex(base32) {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  for (let i = 0; i < base32.length; i++) {
    const val = base32Chars.indexOf(base32.charAt(i).toUpperCase());
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16);
  }

  return hex;
}

function generateOTP() {
  const key = base32ToHex(SECRET);
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const time = Math.floor(epoch / 30).toString(16).padStart(16, "0");

  const hmac = crypto.createHmac("sha1", Buffer.from(key, "hex"));
  hmac.update(Buffer.from(time, "hex"));
  const hmacResult = hmac.digest("hex");

  const offset = parseInt(hmacResult.substring(hmacResult.length - 1), 16);
  const code = (parseInt(hmacResult.substr(offset * 2, 8), 16) & 0x7fffffff) + "";
  return code.substring(code.length - 6);
}

function verifyOTP(code) {
  return generateOTP() === code;
}

module.exports = { generateOTP, verifyOTP };
