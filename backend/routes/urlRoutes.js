const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const shortid = require("shortid");

router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "Long URL is required" });

  const urlCode = shortid.generate();
  const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

  try {
    let existing = await Url.findOne({ longUrl });
    if (existing) return res.json(existing);

    const newUrl = new Url({ longUrl, shortUrl, urlCode });
    await newUrl.save();
    res.json(newUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
