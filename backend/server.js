const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Url = require("./models/Url"); // Schema model
const urlRoutes = require("./routes/urlRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Route to handle API requests for shortening URLs
app.use("/api", urlRoutes);

// ✅ Redirect route (keep this AFTER all other routes)
app.get("/:code", async (req, res) => {
  try {
    const shortCode = req.params.code;
    console.log("🔎 Redirect request received for code:", shortCode);

    const found = await Url.findOne({ urlCode: shortCode });

    if (found) {
      console.log("✅ Found URL:", found.longUrl);
      return res.redirect(found.longUrl);
    } else {
      console.log("❌ Short URL not found in DB");
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    console.error("❌ Error during redirection:", err.message);
    res.status(500).json({ error: "Internal server error during redirect" });
  }
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 🔍 DEBUG: Check if 'XnFBNLcbB' exists in the database
    const testCode = "XnFBNLcbB";
    const testUrl = await Url.findOne({ urlCode: testCode });

    if (testUrl) {
      console.log("✅ TEST: Short code exists:", testUrl);
    } else {
      console.log("❌ TEST: Short code 'XnFBNLcbB' not found in DB");
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
