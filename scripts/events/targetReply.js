const fs = require("fs");
const path = require("path");

const targetsPath = path.join(__dirname, "..", "..", "targetData.json");
const msgPath = path.join(__dirname, "..", "..", "msg.txt");

function readTargets() {
  if (!fs.existsSync(targetsPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(targetsPath, "utf-8"));
  } catch (err) {
    console.error("❌ Error reading targetData.json:", err);
    return [];
  }
}

module.exports = {
  config: {
    name: "targetReply",
    version: "1.0",
    author: "ChatGPT",
    description: "Reply automatically to target UIDs",
    category: "events" // must be in events folder
  },

  onEvent: async function ({ event, message }) {
    const targets = readTargets();
    const senderID = event.senderID;

    if (!targets.includes(senderID)) return;

    if (!fs.existsSync(msgPath)) return;

    const replyMessage = fs.readFileSync(msgPath, "utf-8").trim();
    if (replyMessage.length > 0) {
      return message.reply(replyMessage);
    }
  }
};
