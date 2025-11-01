import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.MAGICIAN_API_TOKEN;
const baseUrl = process.env.BASE_URL || "http://localhost:3001";

async function runTest() {
  try {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ url: "https://example.com" })
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ API responded correctly:");
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ API test failed:", err.message);
    process.exit(1);
  }
}

runTest();
