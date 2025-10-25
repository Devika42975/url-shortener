async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!longUrl) {
    resultDiv.textContent = "Please enter a valid URL.";
    return;
  }

  try {
    const response = await fetch("https://url-shortener-backend-2ohb.onrender.com/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ longUrl })
    });

    const data = await response.json();

    if (data.shortUrl) {
      resultDiv.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
      resultDiv.textContent = data.error || "Something went wrong.";
    }

  } catch (error) {
    resultDiv.textContent = "Error shortening URL: " + error.message;
  }
}
