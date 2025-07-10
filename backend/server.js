const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Url = require("./models/Url"); // 👈 Needed for redirect
const urlRoutes = require("./routes/urlRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route for shortening
app.use("/api", urlRoutes);

// 🟢 ADD: Route to redirect using short code
app.get("/:code", async (req, res) => {
  try {
    const found = await Url.findOne({ urlCode: req.params.code });
    if (found) return res.redirect(found.longUrl);
    res.status(404).json({ error: "URL not found" });
  } catch (err) {
    res.status(500).json({ error: "Redirect failed" });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
