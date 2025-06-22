const fs = require("fs");
const dataPath = __dirname + "/../targetData.json";
const msgPath = __dirname + "/../msg.txt";

module.exports = {
	config: {
		name: "targetMonitor",
		version: "1.0",
		author: "YourName",
		category: "events"
	},

	onStart: async function ({ event, message }) {
		if (event.type !== "message") return;

		const targets = JSON.parse(fs.readFileSync(dataPath));
		const sender = event.senderID;

		if (!targets[sender]) return;

		if (!fs.existsSync(msgPath)) return;

		const lines = fs.readFileSync(msgPath, "utf-8").split("\n").filter(line => line.trim());

		lines.forEach((line, index) => {
			setTimeout(() => {
				message.send(line, event.threadID);
			}, index * 8000); // 8 seconds interval
		});
	}
};
