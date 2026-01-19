const input = document.getElementById("otp");
let times = [];
let last = Date.now();

input.addEventListener("keydown", () => {
  const now = Date.now();
  times.push(now - last);
  last = now;
});

input.addEventListener("paste", (e) => {
  e.preventDefault();
  alert("Paste not allowed!");
});

window.getTimes = () => times;
