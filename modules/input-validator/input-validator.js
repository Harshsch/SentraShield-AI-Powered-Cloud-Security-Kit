document.getElementById("secure-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const comment = document.getElementById("comment").value.trim();
  const feedback = document.getElementById("feedback");

  const sqliPattern = /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|OR|AND)\b|--|;|'|"|\/\*|\*\/|=|#)/i;

  const xssPattern = /(<script.*?>|<\/script>|on\w+=["'].*?["'])/i;

  let reason = null;

  if (sqliPattern.test(username) || sqliPattern.test(comment)) {
    reason = "SQLi pattern";
  } else if (xssPattern.test(username) || xssPattern.test(comment)) {
    reason = "XSS pattern";
  }

  if (reason) {
    feedback.innerText = `🚨 Suspicious input detected (${reason}). Logging to cloud.`;
    feedback.className = "warning";

    // Replace with your actual API Gateway endpoint
    fetch("https://9wjpdquiq1.execute-api.eu-north-1.amazonaws.com/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ip: "unknown", // Optional: add real IP from CloudFront later
        username: username,
        comment: comment,
        reason: reason
      })
    })
    .then(res => res.json())
    .then(data => console.log("✅ Logged to AWS:", data))
    .catch(err => console.error("❌ Logging failed:", err));

    return;
  }

  feedback.innerText = "✅ Input appears safe. Form submitted.";
  feedback.className = "safe";

  // Optionally allow actual form submission here if needed
});
