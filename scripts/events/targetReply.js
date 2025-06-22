const fs = require("fs");
const path = require("path");

const msgFile = path.join(__dirname, "..", "cmds", "msg.txt");
const tgtFile = path.join(__dirname, "..", "cmds", "target.json");

let loops = {};

function getMsgLines() {
  return fs.existsSync(msgFile)
    ? fs.readFileSync(msgFile, "utf-8").split("\n").filter(l => l.trim())
    : [];
}

function getTargets() {
  return fs.existsSync(tgtFile)
    ? JSON.parse(fs.readFileSync(tgtFile, "utf-8") || "[]")
    : [];
}

module.exports = {
  config: {
    name: "targetReply",
    version: "1.0",
    author: "ChatGPT",
    category: "events"
  },
  onChat: async function({ event, api }) {
    const { senderID, threadID } = event;
    const lines = getMsgLines();
    const targets = getTargets();

    if (!targets.includes(senderID)) return;

    if (loops[senderID]) return;
    loops[senderID] = true;

    let idx = 0;
    const iv = setInterval(() => {
      api.sendMessage(lines[idx], threadID);
      idx++;
      if (idx >= lines.length) {
        clearInterval(iv);
        delete loops[senderID];
      }
    }, 8000);
  }
};
