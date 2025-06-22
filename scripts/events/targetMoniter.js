const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../targetData.json");
const msgPath = path.join(__dirname, "../msg.txt");

let lastSent = {};

function readTargets() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch {
    return [];
  }
}

function readMessages() {
  try {
    return fs.readFileSync(msgPath, "utf8").split("\n").filter(m => m.trim() !== "");
  } catch {
    return [];
  }
}

module.exports = {
  config: {
    name: "targetMonitor",
    version: "1.0",
    author: "YourName",
    category: "events"
  },

  onStart: async function ({ event, message }) {
    if (!event?.senderID || !event?.body) return;

    const targets = readTargets();
    const messages = readMessages();
    const sender = event.senderID;

    if (!targets.includes(sender)) return;

    const now = Date.now();
    if (!lastSent[sender] || now - lastSent[sender] >= 8000) {
      lastSent[sender] = now;

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      try {
        await message.reply({
          body: randomMsg,
          mentions: [{ id: sender, tag: "@" }]
        });
        console.log(`[targetMonitor] ✅ Replied to ${sender}`);
      } catch (err) {
        console.log(`[targetMonitor] ❌ Failed to reply:`, err);
      }
    } else {
      console.log(`[targetMonitor] ⏳ Waiting to reply to ${sender}`);
    }
  }
};
