const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");

const cfg = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const WEBHOOK = cfg.webhook;
const PLACE_ID = cfg.placeId;
const CHECK_INTERVAL = cfg.checkInterval || 30000;

const seenJobs = new Set();

async function fetchServers(cursor = "") {
  const url = `https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?sortOrder=Asc&limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
  const resp = await axios.get(url);
  return resp.data;
}

function launcherScript(jobId) {
  // Replace with your machine's SSH or command mechanism
  // For demo: assuming SSH to Windows VPS that runs launcher.ps1 with jobId
  const cmd = `ssh vps "powershell.exe -ExecutionPolicy Bypass -File C:/roblox-bot/launcher.ps1 ${jobId}"`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) console.error("Launcher error:", err);
  });
}

async function notifyDiscord(jobId) {
  const joinUrl = `https://chillihub1.github.io/chillihub-joiner/?placeId=${PLACE_ID}&gameInstanceId=${jobId}`;
  const embed = {
    title: "🚨 Radioactive Foxy Detected!",
    description: `[Click to Join the Server](${joinUrl})`,
    color: 0xFF0000,
    fields: [
      { name: "Place ID", value: PLACE_ID, inline: true },
      { name: "Job ID", value: jobId, inline: true }
    ],
    timestamp: new Date().toISOString()
  };
  await axios.post(WEBHOOK, { embeds: [embed] });
  console.log("Discord notified for:", jobId);
}

async function scanServers() {
  let cursor = "";
  do {
    const data = await fetchServers(cursor);
    for (const server of data.data || []) {
      if (!seenJobs.has(server.id)) {
        seenJobs.add(server.id);
        // Trigger the bot to join & check
        launcherScript(server.id);
      }
    }
    cursor = data.nextPageCursor || "";
  } while (cursor);
}

(async () => {
  console.log("Starting monitor...");
  await scanServers();
  setInterval(scanServers, CHECK_INTERVAL);
})();
