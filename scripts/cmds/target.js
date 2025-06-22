const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "..", "..", "targetData.json");

function readTargets() {
  if (!fs.existsSync(targetFile)) return [];
  try {
    const data = fs.readFileSync(targetFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTargets(data) {
  fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "OpenAI",
    role: 0,
    shortDescription: "Add/remove targets and list them",
    longDescription: "Allows you to add, remove or view target list",
    category: "utility",
    guide: {
      en: "{pn} add <text> | {pn} remove <index> | {pn} list",
    },
  },

  onStart: async function ({ message, args }) {
    const subCmd = args[0];
    const targets = readTargets();

    switch (subCmd) {
      case "add": {
        const text = args.slice(1).join(" ");
        if (!text) return message.reply("❌ Please provide text to add.");
        targets.push(text);
        writeTargets(targets);
        return message.reply(`✅ Added: "${text}"`);
      }

      case "remove": {
        const index = parseInt(args[1]);
        if (isNaN(index) || index < 1 || index > targets.length)
          return message.reply("❌ Invalid index.");
        const removed = targets.splice(index - 1, 1);
        writeTargets(targets);
        return message.reply(`✅ Removed: "${removed[0]}"`);
      }

      case "list": {
        if (targets.length === 0) return message.reply("📭 No targets found.");
        const list = targets.map((item, i) => `${i + 1}. ${item}`).join("\n");
        return message.reply(`📋 Target list:\n${list}`);
      }

      default:
        return message.reply("❓ Usage: target add/remove/list");
    }
  },
};
