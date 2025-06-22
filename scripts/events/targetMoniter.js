const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../targetData.json");
const msgPath = path.join(__dirname, "../msg.txt");

let lastSent = {};

function readTargets() {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read targetData.json", err);
    return [];
  }
}

function readMessages() {
  try {
    const content = fs.readFileSync(msgPath, "utf8");
    return content.split("\n").filter(line => line.trim() !== "");
  } catch (err) {
    console.error("Failed to read msg.txt", err);
    return [];
  }
}

module.exports = {
  config: {
    name: "targetMonitor",
    version: "1.0",
    author: "you",
    category: "events"
  },

  onStart: async function ({ event, message }) {
    console.log("✅ targetMonitor triggered. Sender:", event.senderID);

    const targets = readTargets();
    const messages = readMessages();

    if (!event.senderID || !event.body) return;

    if (targets.includes(event.senderID)) {
      const now = Date.now();
      if (!lastSent[event.senderID] || now - lastSent[event.senderID] > 8000) {
        lastSent[event.senderID] = now;

        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        message.reply({
          body: randomMsg,
          mentions: [{
            id: event.senderID,
            tag: '@target'
          }]
        });
      }
    }
  }
};
