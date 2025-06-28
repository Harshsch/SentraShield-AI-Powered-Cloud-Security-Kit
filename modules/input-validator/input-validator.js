document.getElementById('secureForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent actual form submission

  const username = document.getElementById('username').value;
  const comment = document.getElementById('comment').value;
  const feedback = document.getElementById('feedback');

  // Basic pattern checks
  const xssPattern = /<script.*?>|onerror=|onload=|alert\(/gi;
  const sqliPattern = /\b(SELECT|INSERT|DELETE|DROP|UPDATE|UNION|BENCHMARK|SLEEP|1\s*=\s*1|--|\|\||&&)\b/gi;
  const blacklistPattern = /[{}$%<>]/g;

  let warningMsg = [];

  if (xssPattern.test(comment) || xssPattern.test(username)) {
    warningMsg.push("🚨 Potential XSS detected.");
  }

  if (sqliPattern.test(comment) || sqliPattern.test(username)) {
    warningMsg.push("🚨 Possible SQL injection pattern detected.");
  }

  if (blacklistPattern.test(username)) {
    warningMsg.push("🚨 Disallowed characters in username.");
  }

  if (warningMsg.length > 0) {
    feedback.innerHTML = warningMsg.join("<br>");
    feedback.className = "warning";
    // Optional: Log to Firebase
    // logSuspiciousInput({ username, comment, type: "client-detected" });
  } else {
    feedback.innerHTML = "✅ Input appears safe. Form submitted.";
    feedback.className = "success";

    // TODO: Submit to backend or log clean input
    // alert("Safe input submitted!");
  }
});

// Optional: Hook to Firebase (you can expand this later)
// function logSuspiciousInput(data) {
//   console.log("Would log to Firebase:", data);
// }
