async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value;
  if (!longUrl) {
    alert("Please enter a URL!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ longUrl })
    });

    const data = await res.json();

    if (data.shortUrl) {
      const shortUrlElem = document.getElementById("shortUrl");
      shortUrlElem.href = data.shortUrl;
      shortUrlElem.textContent = data.shortUrl;
      document.getElementById("result").classList.remove("hidden");
    } else {
      alert(data.error || "Failed to shorten URL");
    }
  } catch (err) {
    alert("Server error. Make sure your backend is running.");
    console.error(err);
  }
}

function copyUrl() {
  const shortUrl = document.getElementById("shortUrl").textContent;
  navigator.clipboard.writeText(shortUrl).then(() => {
    alert("Short URL copied to clipboard!");
  });
}
