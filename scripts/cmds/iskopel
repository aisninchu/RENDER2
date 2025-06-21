const fs = require("fs");

let loopInterval = {};

module.exports = {
  config: {
    name: "iskopel",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 2, // Bot admin only
    description: {
      vi: "Gửi tin nhắn lặp từ file np.txt mỗi 15 giây",
      en: "Loop messages from np.txt every 15 seconds"
    },
    category: "auto",
    guide: {
      vi: "{pn} | {pn} off",
      en: "{pn} | {pn} off"
    }
  },

  onStart: async function ({ message, event, args }) {
    const { threadID } = event;

    // Tắt loop
    if (args[0]?.toLowerCase() === "off") {
      if (loopInterval[threadID]) {
        clearInterval(loopInterval[threadID]);
        delete loopInterval[threadID];
        return message.reply("⛔ Auto send message is disabled.");
      } else {
        return message.reply("⚠️ No loops are running.");
      }
    }

    // Bắt đầu gửi loop
    let filePath = __dirname + "/np.txt";
    if (!fs.existsSync(filePath))
      return message.reply("❌ File np.txt does not exist in the same directory as command.");

    let content = fs.readFileSync(filePath, "utf-8").split("\n").filter(line => line.trim() !== "");

    if (content.length === 0)
      return message.reply("❌ File np.txt empty or invalid content.");

    let index = 0;

    loopInterval[threadID] = setInterval(() => {
      message.send(`${content[index]}`);
      index = (index + 1) % content.length; // Loop back to start
    }, 15000); // 15 seconds

    return message.reply("✅ Start sending automatic messages every 15 seconds from np.txt.");
  }
};
