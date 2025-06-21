const fs = require("fs");
const path = require("path");
const targetFile = path.join(__dirname, "..", "events", "target.txt");

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "YourName",
    role: 1,
    description: {
      en: "Add/remove target users"
    },
    category: "admin",
    guide: {
      en: "{pn} add <uid>\n{pn} remove <uid>\n{pn} list"
    }
  },

  onStart: async function ({ message, args }) {
    const subcommand = args[0]?.toLowerCase();
    const uid = args[1];

    if (!fs.existsSync(targetFile)) fs.writeFileSync(targetFile, "");

    const targets = fs.readFileSync(targetFile, "utf-8").split("\n").filter(Boolean);

    switch (subcommand) {
      case "add":
        if (!uid) return message.reply("❌ Please provide a UID.");
        if (targets.includes(uid)) return message.reply("✅ UID already in target list.");
        fs.appendFileSync(targetFile, uid + "\n");
        return message.reply(`✅ UID ${uid} added to target list.`);

      case "remove":
        if (!uid) return message.reply("❌ Please provide a UID.");
        const updated = targets.filter(u => u !== uid);
        fs.writeFileSync(targetFile, updated.join("\n"));
        return message.reply(`✅ UID ${uid} removed.`);

      case "list":
        if (targets.length === 0) return message.reply("📂 Target list is empty.");
        return message.reply("🎯 Target List:\n" + targets.join("\n"));

      default:
        return message.reply("❌ Invalid command.\nUse: add/remove/list <uid>");
    }
  }
};
