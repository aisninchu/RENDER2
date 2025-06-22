const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "..", "targetData.json");
const msgPath = path.join(__dirname, "..", "..", "msg.txt");

function readTargets() {
  if (!fs.existsSync(dataPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch (err) {
    console.error("❌ Failed to parse targetData.json:", err);
    return [];
  }
}

function saveTargets(targets) {
  fs.writeFileSync(dataPath, JSON.stringify(targets, null, 2));
}

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "ChatGPT",
    role: 2,
    category: "tools", // ✅ FIXED
    description: "Add/remove UIDs for auto reply"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ Use `target on UID` or `target off UID`");

    const command = args[0].toLowerCase();
    const uid = args[1];

    if (!uid || isNaN(uid)) return message.reply("❌ Please provide a valid UID.");

    const targets = readTargets();

    if (command === "on") {
      if (!targets.includes(uid)) {
        targets.push(uid);
        saveTargets(targets);
        return message.reply(`✅ UID ${uid} added to target list.`);
      } else {
        return message.reply("⚠️ UID already in target list.");
      }
    }

    if (command === "off") {
      if (targets.includes(uid)) {
        const updated = targets.filter(id => id !== uid);
        saveTargets(updated);
        return message.reply(`❌ UID ${uid} removed from target list.`);
      } else {
        return message.reply("⚠️ UID not found in target list.");
      }
    }

    return message.reply("❓ Unknown command. Use `on` or `off`.");
  },

  onChat: async function ({ event, message }) {
    const targets = readTargets();
    const senderID = event.senderID;

    if (targets.includes(senderID)) {
      if (!fs.existsSync(msgPath)) return;
      const text = fs.readFileSync(msgPath, "utf-8").trim();
      if (text) {
        return message.reply(text);
      }
    }
  }
};
