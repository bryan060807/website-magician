import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env for local dev
dotenv.config();

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                             PUBLIC HEALTH ROUTES                           */
/* -------------------------------------------------------------------------- */

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "Website Magician API is alive ✨" });
});

// 🧪 Debug route to verify environment variable (safe to expose)
app.get("/debug/env", (req, res) => {
  const hasToken = !!process.env.MAGICIAN_API_TOKEN;
  res.json({
    envDetected: hasToken,
    tokenLength: hasToken ? process.env.MAGICIAN_API_TOKEN.length : 0,
    note: hasToken
      ? "MAGICIAN_API_TOKEN is loaded correctly."
      : "MAGICIAN_API_TOKEN is missing. Check your Vercel environment variables."
  });
});

/* -------------------------------------------------------------------------- */
/*                             PROTECTED ROUTES                               */
/* -------------------------------------------------------------------------- */

// 🔒 Middleware for all routes below this line
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const expected = `Bearer ${process.env.MAGICIAN_API_TOKEN}`;
  if (auth !== expected) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or missing API token" });
  }
  next();
});

// 🧩 Analyze website
app.post("/api/analyze", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing 'url' in request body" });

    const fakeReport = {
      seo: 83,
      performance: 78,
      accessibility: 90,
      issues: ["Missing alt text", "No meta description", "Unoptimized images"]
    };

    res.json({
      url,
      summary: `Analysis complete for ${url}`,
      report: fakeReport
    });
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✍️ Generate copy
app.post("/api/copywriter", async (req, res) => {
  try {
    const { audience, goal, tone } = req.body;
    if (!audience || !goal) {
      return res.status(400).json({ error: "Missing 'audience' or 'goal'" });
    }

    res.json({
      headline: "Transform Your Website Into a Conversion Machine",
      subheadline: `Built for ${audience}, designed to ${goal}.`,
      tone: tone || "neutral",
      cta: "Book Your Free Audit"
    });
  } catch (err) {
    console.error("Error in /api/copywriter:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📐 Suggest layout
app.post("/api/layout", async (req, res) => {
  try {
    const { site_type, goal } = req.body;
    if (!site_type || !goal) {
      return res.status(400).json({ error: "Missing 'site_type' or 'goal'" });
    }

    res.json({
      site_type,
      goal,
      suggested_layout: [
        "Hero banner with CTA",
        "Feature highlights section",
        "Testimonials carousel",
        "Contact form in footer"
      ]
    });
  } catch (err) {
    console.error("Error in /api/layout:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🧾 Summarize feedback
app.post("/api/summarize", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing 'data' in request body" });

    res.json({
      summary:
        "Your homepage loads in 3.2s (a bit slow). SEO score 72 — missing meta descriptions and alt tags.",
      recommended_actions: [
        "Compress images",
        "Add alt text to all images",
        "Write a proper meta description"
      ]
    });
  } catch (err) {
    console.error("Error in /api/summarize:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                              SERVER STARTUP                                */
/* -------------------------------------------------------------------------- */

// Vercel uses the exported handler; only start manually if local
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// Export for Vercel’s serverless function handler
export default app;
