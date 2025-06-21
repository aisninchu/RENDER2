const fs = require("fs");

const activeLoops = new Map();

module.exports = {
  config: {
    name: "ibmpel",
    version: "1.1",
    author: "ChatGPT",
    role: 2,
    description: {
      en: "Send messages from np2.txt to a user inbox in a loop. Start/Stop supported."
    },
    category: "inbox",
    guide: {
      en: "/ibmpel <userID> to start\n/ibmpel stop <userID> to stop"
    }
  },

  onStart: async function ({ args, message, api }) {
    const subCommand = args[0];
    const userID = args[1] || args[0]; // fallback if no stop

    // STOP command
    if (subCommand?.toLowerCase() === "stop") {
      if (!activeLoops.has(userID)) {
        return message.reply(`⚠️ No active loop found for user ID: ${userID}`);
      }

      clearInterval(activeLoops.get(userID));
      activeLoops.delete(userID);
      return message.reply(`🛑 Loop stopped for user ID: ${userID}`);
    }

    // START command
    if (!userID || isNaN(userID)) {
      return message.reply("❌ Use format:\n/ibmpel <userID>\n/ibmpel stop <userID>");
    }

    if (!fs.existsSync("np2.txt")) {
      return message.reply("❌ File np2.txt not found.");
    }

    const content = fs.readFileSync("np2.txt", "utf-8").split("\n").filter(line => line.trim() !== "");

    if (content.length === 0) {
      return message.reply("❌ np2.txt is empty.");
    }

    if (activeLoops.has(userID)) {
      return message.reply("⚠️ This user is already receiving loop messages.");
    }

    message.reply(`✅ Loop started. Sending messages to userID: ${userID} every 15 seconds.`);

    let index = 0;
    const interval = setInterval(() => {
      api.sendMessage(content[index], userID, (err) => {
        if (err) {
          console.log(`❌ Failed to send message to ${userID}:`, err.message);
        }
      });
      index = (index + 1) % content.length;
    }, 15000);

    activeLoops.set(userID, interval);
  }
};
