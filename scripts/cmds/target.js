// cmds/target.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "targetData.json");

function readTargets() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeTargets(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  config: {
    name: "target",
    version: "1.0",
    author: "Aryan",
    category: "admin",
    description: "Set custom reply for target user",
    usage: "<@mention> <message>"
  },

  onCall: function ({ message, args, reply, mentions, event }) {
    const targets = readTargets();
    const threadID = event.threadID;

    if (!mentions || Object.keys(mentions).length === 0) {
      return message.reply("Kise tag karu be?");
    }

    const mentionID = Object.keys(mentions)[0];
    const msg = args.slice(1).join(" ");

    if (!msg) {
      return message.reply("Reply message bhi toh de be?");
    }

    if (!targets[threadID]) targets[threadID] = {};
    targets[threadID][mentionID] = msg;

    writeTargets(targets);

    reply(`Set reply for @${mentions[mentionID]}:\n"${msg}"`);
  }
};
