const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "target.json");

function getTargets() {
  try {
    const d = fs.readFileSync(file, "utf-8");
    return JSON.parse(d || "[]");
  } catch {
    fs.writeFileSync(file, "[]");
    return [];
  }
}

function saveTargets(list) {
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "ChatGPT",
    role: 2
  },
  onStart: async function ({ args, message }) {
    const [cmd, uid] = args;
    if (cmd === "on" && uid) {
      const list = getTargets();
      if (!list.includes(uid)) {
        list.push(uid);
        saveTargets(list);
        return message.reply(`✅ UID ${uid} added.`);
      }
      return message.reply("⚠️ Already added.");
    }
    if (cmd === "off" && uid) {
      let list = getTargets();
      if (list.includes(uid)) {
        list = list.filter(i => i !== uid);
        saveTargets(list);
        return message.reply(`✅ UID ${uid} removed.`);
      }
      return message.reply("⚠️ Not in list.");
    }
    if (cmd === "list") {
      const list = getTargets();
      return message.reply("🎯 Targets:\n" + (list.join("\n") || "None"));
    }
    message.reply("Usage: target on|off|list <UID>");
  }
};
