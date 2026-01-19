let start = performance.now();
let ikis = [];
let last = null;

document.getElementById("otp").addEventListener("keydown", e => {
  let now = performance.now();
  if (last !== null) ikis.push(now - last);
  last = now;
});
