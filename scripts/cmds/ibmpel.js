const fs = require("fs");
const path = require("path");

let runningLoops = {};

module.exports = {
  config: {
    name: "ibmpel",
    version: "1.0",
    author: "ChatGPT",
    role: 2,
    description: {
      en: "Send looping messages to a user from np2.txt"
    },
    category: "inbox",
    guide: {
      en: "{pn} [UID] - Start\n{pn} stop [UID] - Stop"
    }
  },

  onStart: async function ({ message, args, api }) {
    if (!args[0]) return message.reply("❌ Please provide a UID or `stop [UID]`.");

    // STOP command
    if (args[0].toLowerCase() === "stop") {
      const stopUid = args[1];
      if (!stopUid) return message.reply("❌ Please provide UID to stop.");
      if (runningLoops[stopUid]) {
        clearInterval(runningLoops[stopUid]);
        delete runningLoops[stopUid];
        return message.reply(`🛑 Stopped inbox messages to UID: ${stopUid}`);
      } else {
        return message.reply(`⚠️ No running loop for UID: ${stopUid}`);
      }
    }

    // START command
    const uid = args[0];

    const filePath = path.join(__dirname, "np2.txt");
    let lines;
    try {
      lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
    } catch (err) {
      return message.reply("❌ File `np2.txt` not found or unreadable.");
    }

    if (lines.length === 0) return message.reply("❌ File is empty.");

    message.reply(`✅ Starting inbox message loop to UID: ${uid}`);

    let index = 0;
    runningLoops[uid] = setInterval(() => {
      if (!lines[index]) index = 0; // Loop back to start
      api.sendMessage(lines[index], uid);
      index++;
    }, 15000); // 15 seconds
  }
};
