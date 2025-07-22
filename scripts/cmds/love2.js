const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "love2",
    aliases: ["love2"],
    version: "1.0",
    author: "MOHAMMAD-BADOL",
    countDown: 5,
    role: 0,
    shortDescription: "love dp",
    longDescription: "",
    category: "photo",
    guide: ""
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length)
      return message.reply("💚আপনি যাকে ভালবাসেন তাকে মেনশন করুন প্লিজ✅");

    // temp ফাইল safe/unqiue রাখার জন্য আলাদা নাম
    const outPath = path.join(__dirname, "cache", `love8_${event.senderID}_${Date.now()}.png`);
    // mention.length >=1, ২ জন হলে দুই প্রথম mention, ১ জন হলে sender+mention
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await makeLove8(one, two, outPath);

      await message.reply({
        body: "╔⏤⏤⏤╝❮❮RAFI❯❯╚⏤⏤⏤╗\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n─⃜⃜͢͢🍒͟͟͞͞๛⃝  🥹🥴 .!চিপায় আসো ঝাল মুড়ি বানাইছি ..🥱🫰─⃜⃜͢͢💦🍒͟͟͞͞๛⃝\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n╔⏤⏤⏤╝❮❮R A F Iメ❯❯╚⏤⏤⏤╗",
        attachment: fs.createReadStream(outPath)
      });

      fs.unlinkSync(outPath); // temp ডিলিট
    } catch (e) {
      console.error("love8 cmd error:", e);
      message.reply("Error creating image!");
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    }
  }
};

async function makeLove8(one, two, outPath) {
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`);
  avone.circle();
  const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`);
  avtwo.circle();
  const img = await jimp.read("https://i.imgur.com/lPRqOl4.jpeg");
  img.resize(1440, 1080)
     .composite(avone.resize(470, 470), 125, 210)
     .composite(avtwo.resize(470, 470), 800, 200);
  await img.writeAsync(outPath);
}
