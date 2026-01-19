const attempts = {};
const WINDOW = 5 * 60 * 1000; // 5 min
const MAX_ATTEMPTS = 3;

function limiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!attempts[ip]) attempts[ip] = [];

  attempts[ip] = attempts[ip].filter(t => now - t < WINDOW);

  if (attempts[ip].length >= MAX_ATTEMPTS) {
    return res.json({ error: "Too many attempts! Try again later." });
  }

  attempts[ip].push(now);
  next();
}

function validateTiming(times) {
  if (!times || !Array.isArray(times)) return false;

  const totalTime = times[times.length - 1] - times[0];
  if (totalTime > 15000) return false;

  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] > 5000) return false;
  }

  return true;
}

module.exports = { limiter, validateTiming };
