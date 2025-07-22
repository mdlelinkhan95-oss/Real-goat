const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "wishmake",
    aliases: ["ws"],
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "wholesome",
    longDescription: "wholesome avatar for crush/lover",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length) return message.reply("You must tag someone!");

    // প্রথম mention ইউজ করো:
    const userId = mention[0];

    try {
      const imgPath = await createWholesomeImg(userId, event.senderID);
      await message.reply({
        body: "「 is that true?🥰❤️ 」",
        attachment: fs.createReadStream(imgPath)
      });
      fs.unlinkSync(imgPath); // temp ফাইল পরিষ্কার
    } catch (error) {
      console.error("wholesome cmd error:", error);
      await message.reply("❌ অনাকাঙ্ক্ষিত সমস্যা ঘটেছে, আবার চেষ্টা করুন!");
    }
  }
};

// helper function
async function createWholesomeImg(targetId, senderId) {
  // unique ফাইলনেম
  const tempOut = path.join(__dirname, "cache", `wholesome_${targetId}_${senderId}.png`);
  // ইউজারের এভাটার নাও
  const avatar = await jimp.read(`https://graph.facebook.com/${targetId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  // BG ইমেজ
  const bg = await jimp.read("https://i.imgur.com/BnWiVXT.jpg");

  bg.resize(512, 512)
    .composite(avatar.resize(173, 173), 70, 186);

  await bg.writeAsync(tempOut);
  return tempOut;
}
