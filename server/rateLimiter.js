const attempts = {};

module.exports = (req, res, next) => {
  const ip = req.ip;
  attempts[ip] = (attempts[ip] || 0) + 1;

  if (attempts[ip] > 5) {
    return res.status(429).json({ message: "Too many attempts. Try later." });
  }
  next();
};
