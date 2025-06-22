const fs = require("fs");
const path = require("path");

let activeReplies = {};

const targetFilePath = path.join(__dirname, "target.json");
const messageFilePath = path.join(__dirname, "msg.txt");

function readTargets() {
  if (!fs.existsSync(targetFilePath)) return [];
  return JSON.parse(fs.readFileSync(targetFilePath, "utf-8"));
}

function saveTargets(data) {
  fs.writeFileSync(targetFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "ChatGPT x You",
    description: "Auto reply target users from msg.txt",
    role: 2,
    category: "auto"
  },

  onStart: async function ({ message, event, args }) {
    const [action, uid] = args;

    if (action === "on" && uid) {
      let targets = readTargets();
      if (!targets.includes(uid)) {
        targets.push(uid);
        saveTargets(targets);
        return message.reply(`✅ UID ${uid} added to target list.`);
      } else {
        return message.reply(`⚠️ UID ${uid} is already in target list.`);
      }
    }

    if (action === "off" && uid) {
      let targets = readTargets();
      if (targets.includes(uid)) {
        targets = targets.filter(id => id !== uid);
        saveTargets(targets);
        return message.reply(`✅ UID ${uid} removed from target list.`);
      } else {
        return message.reply(`❌ UID ${uid} not found in list.`);
      }
    }

    if (action === "list") {
      const targets = readTargets();
      if (targets.length === 0) return message.reply("📭 No target UIDs found.");
      return message.reply("🎯 Target UIDs:\n" + targets.join("\n"));
    }

    return message.reply("📌 Use:\n- target on <uid>\n- target off <uid>\n- target list");
  },

  onChat: async function ({ event, message }) {
    const { senderID, threadID } = event;

    const targets = readTargets();
    if (!targets.includes(senderID)) return;

    if (activeReplies[threadID + senderID]) return; // already replying

    if (!fs.existsSync(messageFilePath)) return;

    const lines = fs.readFileSync(messageFilePath, "utf-8").split("\n").filter(l => l.trim() !== "");
    if (lines.length === 0) return;

    let index = 0;
    activeReplies[threadID + senderID] = true;

    const interval = setInterval(() => {
      if (index >= lines.length) {
        clearInterval(interval);
        delete activeReplies[threadID + senderID];
        return;
      }
      message.reply(lines[index]);
      index++;
    }, 8000); // 8 seconds delay
  }
};
