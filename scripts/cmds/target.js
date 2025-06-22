const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "target.json");

function getTargets() {
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data || "[]");
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
    author: "OpenAI",
    role: 2,
    description: "Add/remove target UID to auto-reply"
  },

  onStart: async ({ args, message }) => {
    const targets = getTargets();
    const uid = args[0];

    if (!uid || isNaN(uid)) return message.reply("❌ UID do bhai.");

    if (targets.includes(uid)) {
      return message.reply("⚠️ UID already added.");
    }

    targets.push(uid);
    saveTargets(targets);
    message.reply(`✅ Target UID added: ${uid}`);
  }
};
