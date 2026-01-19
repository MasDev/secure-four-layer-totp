const attempts = new Map();

module.exports = function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!attempts.has(ip)) attempts.set(ip, []);
  const logs = attempts.get(ip).filter(t => now - t < 5 * 60 * 1000);

  logs.push(now);
  attempts.set(ip, logs);

  if (logs.length > 3) {
    return res.json({
      layer: 1,
      fail: true,
      message: "Layer 1 Failed: Rate limit exceeded (3 attempts / 5 mins)"
    });
  }

  next();
};
