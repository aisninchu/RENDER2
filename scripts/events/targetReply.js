// events/targetReply.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../cmds/targetData.json");

function readTargets() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

module.exports = {
  config: {
    name: "targetReply"
  },

  onMessage: function ({ message, event, reply }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const targets = readTargets();

    if (targets[threadID] && targets[threadID][senderID]) {
      reply(targets[threadID][senderID]);
    }
  }
};
