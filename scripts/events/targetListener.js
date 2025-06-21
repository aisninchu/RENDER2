const fs = require("fs");
const path = require("path");
const targetPath = path.join(__dirname, "target.txt");
const messagePath = path.join(__dirname, "targetmsg.txt");

module.exports = {
  config: {
    name: "targetListener",
    version: "1.0",
    author: "YourName",
    category: "events"
  },

  onStart: async function () {
    if (!fs.existsSync(targetPath)) fs.writeFileSync(targetPath, "");
    if (!fs.existsSync(messagePath)) fs.writeFileSync(messagePath, "");
  },

  onChat: async function ({ event, api }) {
    const senderID = event.senderID;

    const targets = fs.readFileSync(targetPath, "utf-8").split("\n").filter(Boolean);
    if (!targets.includes(senderID)) return;

    const messages = fs.readFileSync(messagePath, "utf-8").split("\n").filter(Boolean);
    if (messages.length === 0) return;

    for (const msg of messages) {
      await new Promise(res => setTimeout(res, 5000));
      api.sendMessage(msg, event.threadID);
    }

    await new Promise(res => setTimeout(res, 10000)); // Delay before replying again
  }
};
