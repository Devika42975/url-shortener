const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const shortid = require("shortid");

// 📌 POST route to shorten a long URL
router.post("/shorten", async (req, res) => {
  try {
    const longUrl = req.body.longUrl?.trim();

    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    const urlCode = shortid.generate();
    const baseUrl = process.env.BASE_URL;

    if (!baseUrl) {
      console.error("❌ BASE_URL is not defined in .env");
      return res.status(500).json({ error: "BASE_URL is missing" });
    }

    const shortUrl = `${baseUrl}/${urlCode}`;

    // 🧠 Check for existing long URL
    let existing = await Url.findOne({ longUrl });

    if (existing) {
      // ✅ If shortUrl contains localhost, regenerate with new BASE_URL
      if (!existing.shortUrl.startsWith(baseUrl)) {
        existing.shortUrl = `${baseUrl}/${existing.urlCode}`;
        await existing.save();
        console.log("🔁 Updated old short URL to new BASE_URL:", existing.shortUrl);
      } else {
        console.log("🔁 Reusing existing short URL:", existing.shortUrl);
      }

      return res.json(existing);
    }

    // ✅ If not found, create new
    const newUrl = new Url({ longUrl, shortUrl, urlCode });
    await newUrl.save();
    console.log("✅ New short URL created:", shortUrl);
    res.json(newUrl);
  } catch (err) {
    console.error("❌ Error shortening URL:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
