module.exports = {
  config: {
    name: "groupnamelock",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 2, // केवल Bot Admin ही इस कमांड को चला सकता है
    description: {
      vi: "Khoá tên nhóm theo tên chỉ định",
      en: "Lock group name to specified name"
    },
    category: "box chat",
    guide: {
      vi: "{pn} [tên nhóm mới] | {pn} off",
      en: "{pn} [new group name] | {pn} off"
    }
  },

  onStart: async function ({ message, args, threadsData, event, api }) {
    const { threadID } = event;

    // यदि user "off" लिखता है तो लॉक हटाओ
    if (args[0]?.toLowerCase() === "off") {
      await threadsData.set(threadID, {
        name: null,
        status: false
      }, "data.groupNameLock");
      return message.reply("✅ Group name lock हटा दिया गया है।");
    }

    const newName = args.join(" ");
    if (!newName)
      return message.reply("❌ कृपया नया ग्रुप नाम डालें।");

    // डेटा सेव करो
    await threadsData.set(threadID, {
      name: newName,
      status: true
    }, "data.groupNameLock");

    // अभी के अभी नाम बदलो
    try {
      await api.setTitle(newName, threadID);
      return message.reply(`🔒 ग्रुप नाम लॉक कर दिया गया है: "${newName}"`);
    } catch (err) {
      return message.reply("❌ नाम बदलने में असमर्थ। कृपया सुनिश्चित करें कि बॉट के पास ग्रुप में एडमिन अधिकार हैं।");
    }
  },

  onEvent: async function ({ event, threadsData, api, role }) {
    if (event.logMessageType !== "log:thread-name")
      return;

    const { threadID, logMessageData, author } = event;
    const data = await threadsData.get(threadID, "data.groupNameLock", {});

    if (!data?.status || !data?.name)
      return;

    const newName = logMessageData?.name || "";

    // अगर नाम बदला गया है और बदलने वाला बॉट नहीं है और वो Bot Admin नहीं है
    if (newName !== data.name && api.getCurrentUserID() !== author && role < 2) {
      api.setTitle(data.name, threadID);
    }
  }
};
