const fs = require("fs");
const path = require("path");

const msgFile = path.join(__dirname, "..", "cmds", "msg.txt");
const targetFile = path.join(__dirname, "..", "cmds", "target.json");

const msgList = fs.existsSync(msgFile)
  ? fs.readFileSync(msgFile, "utf-8").split("\n").filter(x => x.trim() !== "")
  : [];

let targetUIDs = [];
if (fs.existsSync(targetFile)) {
  try {
    targetUIDs = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
  } catch (e) {
    targetUIDs = [];
  }
}

let replyTimers = {}; // key = uid, value = interval

module.exports = {
  config: {
    name: "targetReply",
    version: "1.0",
    author: "OpenAI",
    category: "events"
  },

  onChat: async ({ event, message, api }) => {
    const { senderID, threadID } = event;

    if (!targetUIDs.includes(senderID)) return;
    if (replyTimers[senderID]) return; // already replying

    let index = 0;
    replyTimers[senderID] = setInterval(() => {
      api.sendMessage(msgList[index], threadID);
      index = (index + 1) % msgList.length;
    }, 8000); // 8 sec

    // Stop after one full cycle (optional)
    setTimeout(() => {
      clearInterval(replyTimers[senderID]);
      delete replyTimers[senderID];
    }, msgList.length * 8000 + 2000); // optional
  }
};
