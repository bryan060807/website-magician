import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env only in local dev
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Authentication middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const expected = `Bearer ${process.env.MAGICIAN_API_TOKEN}`;
  if (auth !== expected) {
    return res.status(403).json({ error: "Forbidden: Invalid or missing API token" });
  }
  next();
});

/* -------------------------------------------------------------------------- */
/*                                API ROUTES                                  */
/* -------------------------------------------------------------------------- */

// 🧩 Analyze Website
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

// ✍️ Generate Copy
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

// 📐 Suggest Layout
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

// 🧾 Summarize Feedback
app.post("/api/summarize", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing 'data' in request body" });

    res.json({
      summary: "Your homepage loads in 3.2s (a bit slow). SEO score 72 — missing meta descriptions and alt tags.",
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
/*                           DEBUG / HEALTH ROUTES                            */
/* -------------------------------------------------------------------------- */

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "Website Magician API is alive ✨" });
});

// 🧪 Debug route to verify environment variable
app.get("/debug/env", (req, res) => {
  const hasToken = !!process.env.MAGICIAN_API_TOKEN;
  res.json({
    envDetected: hasToken,
    tokenLength: hasToken ? process.env.MAGICIAN_API_TOKEN.length : 0,
    port: process.env.PORT || 3001,
    note: hasToken
      ? "MAGICIAN_API_TOKEN is loaded correctly."
      : "MAGICIAN_API_TOKEN is missing. Check your Vercel environment variables."
  });
});

/* -------------------------------------------------------------------------- */
/*                              SERVER STARTUP                                */
/* -------------------------------------------------------------------------- */

// Vercel auto-detects the exported app as a serverless function handler
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// Export app for Vercel
export default app;
