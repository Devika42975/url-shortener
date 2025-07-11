const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const shortid = require("shortid");

// 📌 POST route to shorten a long URL
router.post("/shorten", async (req, res) => {
  try {
    // ✅ Trim extra spaces
    const longUrl = req.body.longUrl?.trim();

    // ❌ Validate input
    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    // ✅ Generate unique short code
    const urlCode = shortid.generate();

    // ✅ Read base URL from environment
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      console.error("❌ BASE_URL is not defined in .env");
      return res.status(500).json({ error: "BASE_URL is missing" });
    }

    const shortUrl = `${baseUrl}/${urlCode}`;

    // 🧠 Check if longUrl already exists
    let existing = await Url.findOne({ longUrl });
    if (existing) {
      console.log("🔁 Reusing existing short URL:", existing.shortUrl);
      return res.json(existing);
    }

    // ✅ Save new shortened URL to DB
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
