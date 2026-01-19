document.getElementById("btnLogin").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  document.getElementById("message").innerText = data.message;
});

document.getElementById("btnVerify").addEventListener("click", async () => {
  const otp = document.getElementById("otp").value;

  const response = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp })
  });

  const data = await response.json();
  document.getElementById("message").innerText = data.message;

  if (data.success) {
    window.location.href = "home.html";
  }
});
