const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "target.txt");
const msgFile = path.join(__dirname, "targetmsg.txt");

function readTargetList() {
  if (!fs.existsSync(targetFile)) return [];
  return fs.readFileSync(targetFile, "utf-8")
    .split("\n")
    .map(x => x.trim())
    .filter(x => x !== "");
}

function saveTargetList(list) {
  fs.writeFileSync(targetFile, list.join("\n"), "utf-8");
}

module.exports = {
  config: {
    name: "target",
    version: "2.0",
    author: "ChatGPT",
    countDown: 5,
    role: 2,
    description: {
      en: "Manage and auto-reply to target users"
    },
    category: "admin",
    guide: {
      en: "{pn} add [uid] | {pn} remove [uid] | {pn} list"
    }
  },

  onStart: async function ({ message, args }) {
    const action = args[0]?.toLowerCase();
    const uid = args[1];

    let list = readTargetList();

    if (action === "add") {
      if (!uid || isNaN(uid)) return message.reply("❌ Invalid UID.");
      if (list.includes(uid)) return message.reply("⚠️ UID already in target list.");
      list.push(uid);
      saveTargetList(list);
      return message.reply(`✅ UID ${uid} added to target list.`);
    }

    if (action === "remove") {
      if (!uid) return message.reply("❌ Provide UID to remove.");
      list = list.filter(x => x !== uid);
      saveTargetList(list);
      return message.reply(`✅ UID ${uid} removed from target list.`);
    }

    if (action === "list") {
      if (list.length === 0) return message.reply("📭 No target UIDs.");
      return message.reply("🎯 Target UIDs:\n" + list.join("\n"));
    }

    return message.reply("❌ Invalid syntax. Use: add [uid], remove [uid], or list.");
  },

  onChat: async function ({ event, api }) {
    const senderID = event.senderID;

    const list = readTargetList();
    if (!list.includes(senderID)) return;
    if (!fs.existsSync(msgFile)) return;

    const messages = fs.readFileSync(msgFile, "utf-8")
      .split("\n")
      .map(x => x.trim())
      .filter(x => x !== "");

    if (messages.length === 0) return;

    await new Promise(res => setTimeout(res, 10000)); // 10s delay before first response

    for (const msg of messages) {
      await api.sendMessage(msg, senderID);
      await new Promise(res => setTimeout(res, 5000)); // 5s delay between each
    }
  }
};
