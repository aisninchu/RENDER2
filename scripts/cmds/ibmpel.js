const fs = require("fs");

let activeLoops = {};

module.exports = {
  config: {
    name: "ibmpel",
    version: "1.0",
    author: "ChatGPT",
    countDown: 5,
    role: 2,
    description: {
      en: "Send looping inbox messages from np2.txt",
    },
    category: "inbox",
    guide: {
      en: "{pn} [userID] | {pn} stop",
    }
  },

  onStart: async function ({ message, args, api }) {
    const userId = args[0];

    if (!userId) {
      return message.reply("❌ Please provide a user ID or `stop`.");
    }

    if (userId.toLowerCase() === "stop") {
      Object.keys(activeLoops).forEach(user => clearInterval(activeLoops[user]));
      activeLoops = {};
      return message.reply("🛑 Stopped all inbox loops.");
    }

    if (activeLoops[userId]) {
      return message.reply("⚠️ Already sending messages to this user.");
    }

    let messages;
    try {
      const fileData = fs.readFileSync("np2.txt", "utf-8");
      messages = fileData.split("\n").filter(line => line.trim() !== "");
    } catch (err) {
      return message.reply("❌ File `np2.txt` not found or unreadable.");
    }

    if (messages.length === 0) {
      return message.reply("❌ `np2.txt` is empty.");
    }

    let index = 0;
    const interval = setInterval(() => {
      api.sendMessage(messages[index], userId);
      index = (index + 1) % messages.length;
    }, 15000);

    activeLoops[userId] = interval;
    message.reply(`✅ Now sending looping inbox messages to user ID: ${userId}`);
  }
};
