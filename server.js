const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require("node-fetch");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// ✅ Replace this with your real Discord webhook
const WEBHOOK_URL = "https://discord.com/api/webhooks/xxx/yyy";

app.post("/api/log-login", async (req, res) => {
  const { username, userId, time } = req.body;

  // 🧾 Optional: Save to file
  const logLine = `${time} - ${username} (${userId})\n`;
  fs.appendFileSync("login-log.txt", logLine);

  // 🔔 Send to Discord
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🔐 Dashboard Login",
        color: 0x5865f2,
        fields: [
          { name: "Username", value: username, inline: true },
          { name: "User ID", value: userId, inline: true },
          { name: "Time", value: new Date().toLocaleString(), inline: false }
        ],
        footer: { text: "Node.js OAuth Logger" }
      }]
    })
  });

  res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
