const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "..", "events", "target.txt");

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "OpenAI",
    role: 2,
    description: {
      en: "Add, remove, or list target UIDs to auto-reply"
    },
    category: "utility",
    guide: {
      en: "/target add <uid>\n/target remove <uid>\n/target list"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❌ Usage: add/remove/list <uid>");

    let targets = [];
    if (fs.existsSync(targetFile)) {
      targets = fs.readFileSync(targetFile, "utf-8").split("\n").filter(Boolean);
    }

    const action = args[0].toLowerCase();

    if (action === "add") {
      const uid = args[1];
      if (!uid) return message.reply("❌ Please provide a UID.");
      if (targets.includes(uid)) return message.reply("⚠️ UID already exists.");
      targets.push(uid);
      fs.writeFileSync(targetFile, targets.join("\n"));
      return message.reply(`✅ UID ${uid} added to target list.`);
    }

    if (action === "remove") {
      const uid = args[1];
      if (!uid) return message.reply("❌ Please provide a UID.");
      if (!targets.includes(uid)) return message.reply("⚠️ UID not found.");
      targets = targets.filter(t => t !== uid);
      fs.writeFileSync(targetFile, targets.join("\n"));
      return message.reply(`✅ UID ${uid} removed from target list.`);
    }

    if (action === "list") {
      if (targets.length === 0) return message.reply("📭 No targets added.");
      return message.reply("🎯 Target UIDs:\n" + targets.join("\n"));
    }

    return message.reply("❌ Invalid action. Use add/remove/list.");
  }
};
