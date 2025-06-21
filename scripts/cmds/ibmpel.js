const fs = require("fs");

const activeLoops = new Map();

module.exports = {
  config: {
    name: "ibmpel",
    version: "1.0",
    author: "OpenAI & You",
    role: 2,
    description: "Loop inbox message from np2.txt",
    category: "inbox",
    guide: {
      en: "/ibmpel [userID] → start\n/stopibmpel → stop"
    }
  },

  onStart: async function ({ message, args, api }) {
    const command = args[0]?.toLowerCase();

    if (command === "stop" || message.body.toLowerCase().startsWith("/stopibmpel")) {
      const interval = activeLoops.get("ibmpel");
      if (interval) {
        clearInterval(interval);
        activeLoops.delete("ibmpel");
        return message.reply("🛑 Inbox loop stopped.");
      } else {
        return message.reply("❌ No loop is running.");
      }
    }

    const userID = args[0];
    if (!userID) return message.reply("❌ Please provide a user ID.");

    if (!fs.existsSync(__dirname + "/np2.txt")) {
      return message.reply("❌ File 'np2.txt' not found in the same folder.");
    }

    const lines = fs.readFileSync(__dirname + "/np2.txt", "utf-8").split("\n").filter(Boolean);
    if (lines.length === 0) return message.reply("❌ File 'np2.txt' is empty.");

    message.reply(`✅ Started sending inbox messages to ${userID}. Use /stopibmpel to stop.`);

    let index = 0;
    const loop = setInterval(() => {
      if (index >= lines.length) index = 0;
      api.sendMessage(lines[index], userID);
      index++;
    }, 15000);

    activeLoops.set("ibmpel", loop);
  }
};
