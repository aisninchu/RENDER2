const fs = require("fs");
const path = require("path");

const msgFile = path.join(__dirname, "msg.txt");
const targetFile = path.join(__dirname, "target.json");

let activeLoops = {}; // Prevent multiple loops

// Ensure target.json exists
if (!fs.existsSync(targetFile)) {
  fs.writeFileSync(targetFile, JSON.stringify([]));
}

function getTargets() {
  return JSON.parse(fs.readFileSync(targetFile, "utf-8"));
}

function saveTargets(targets) {
  fs.writeFileSync(targetFile, JSON.stringify(targets, null, 2));
}

module.exports = {
  config: {
    name: "targetmsg",
    version: "1.0",
    author: "ChatGPT",
    description: "Reply from msg.txt to specific target users",
    category: "auto"
  },

  onStart: async function ({ args, message, event }) {
    const targets = getTargets();
    const { threadID } = event;

    const sub = args[0]?.toLowerCase();
    const uid = args[1];

    if (sub === "on" && uid) {
      if (!targets.includes(uid)) {
        targets.push(uid);
        saveTargets(targets);
        message.reply(`✅ UID ${uid} added to target list.`);
      } else {
        message.reply(`⚠️ UID ${uid} already in list.`);
      }
    } else if (sub === "off" && uid) {
      const index = targets.indexOf(uid);
      if (index !== -1) {
        targets.splice(index, 1);
        saveTargets(targets);
        message.reply(`❌ UID ${uid} removed from target list.`);
      } else {
        message.reply(`⚠️ UID ${uid} not found in list.`);
      }
    } else if (sub === "list") {
      message.reply(`🎯 Target list:\n${targets.join("\n") || "No UIDs added."}`);
    } else {
      message.reply(`❓ Use:\n- ${this.config.name} on <uid>\n- ${this.config.name} off <uid>\n- ${this.config.name} list`);
    }
  },

  onChat: async function ({ event, message }) {
    const { senderID, threadID } = event;

    const targets = getTargets();
    if (!targets.includes(senderID)) return;

    if (activeLoops[senderID]) return; // Already responding
    activeLoops[senderID] = true;

    const messages = fs.readFileSync(msgFile, "utf-8").split("\n").filter(line => line.trim());

    for (const msg of messages) {
      await message.send(msg, threadID);
      await new Promise(resolve => setTimeout(resolve, 8000)); // 8 sec
    }

    delete activeLoops[senderID];
  }
};
