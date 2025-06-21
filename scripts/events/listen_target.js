const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "target.txt");
const messageFile = path.join(__dirname, "targetmsg.txt");

module.exports = async function ({ event, api }) {
  const { senderID, threadID } = event;
  if (!event.body || !senderID) return;

  if (!fs.existsSync(targetFile) || !fs.existsSync(messageFile)) return;

  const targets = fs.readFileSync(targetFile, "utf-8").split("\n").filter(Boolean);
  if (!targets.includes(senderID)) return;

  const messages = fs.readFileSync(messageFile, "utf-8").split("\n").filter(Boolean);
  if (messages.length === 0) return;

  // Send each message with 5s delay, start after 10s delay
  (async () => {
    await new Promise(res => setTimeout(res, 10000)); // wait 10s before reply

    for (const msg of messages) {
      api.sendMessage(msg, threadID);
      await new Promise(res => setTimeout(res, 5000)); // 5s between messages
    }
  })();
};
