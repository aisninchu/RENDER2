const fs = require('fs');
const path = __dirname + "/../targetData.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

function saveData(data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
	config: {
		name: "target",
		version: "1.0",
		author: "YourName",
		countDown: 5,
		role: 2,
		shortDescription: { en: "Add UID to bot targeting" },
		description: { en: "Add a UID so bot replies when they message" },
		category: "admin",
		guide: {
			en: "Use: /target add <uid>\n/target list"
		}
	},

	onStart: async function ({ message, args }) {
		const db = JSON.parse(fs.readFileSync(path));
		const subCommand = args[0];

		if (subCommand === "add") {
			const uid = args[1];
			if (!uid) return message.reply("❌ Please provide a UID.");
			if (!db[uid]) db[uid] = true;
			saveData(db);
			return message.reply(`✅ UID ${uid} added.`);
		}

		if (subCommand === "list") {
			const list = Object.keys(db);
			if (list.length === 0) return message.reply("📭 No targets found.");
			const formatted = list.map((uid, i) => `${i + 1}. ${uid}`).join("\n");
			return message.reply(`🎯 Target List:\n${formatted}`);
		}

		message.reply("❌ Invalid command. Use /target add <uid> or /target list.");
	}
};
