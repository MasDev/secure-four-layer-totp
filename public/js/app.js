document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
  if (data.message) window.location.href = "/otp.html";
});

document.getElementById("otpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const otp = document.getElementById("otp").value;
  const times = window.getTimes();

  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp, times })
  });

  const data = await res.json();
  alert(data.message || data.error);

  if (data.message) {
    window.location.href = "/home.html";
  }
});
