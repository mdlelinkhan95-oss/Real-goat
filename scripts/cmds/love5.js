const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "love5",
    aliases: ["love 2 love"],
    version: "1.0",
    author: "MOHAMMAD-BADOL", // Do not remove credit
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

    // temp ফাইল প্রতি ইউজার-সেশন আলাদা
    const tempPath = path.join(__dirname, "cache", `love7_${event.senderID}_${Date.now()}.png`);
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await makeLove7(one, two, tempPath);
      await message.reply({
        body: "╔⏤⏤⏤╝❮❮RAFI❯❯╚⏤⏤⏤╗\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nতাকে ভূলে থাকার কারণ অনেক থাকলেও তার হয়ে কাছে থাকার Option একটাই তার চোখের মায়া😚🫦\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n╔⏤⏤⏤╝❮❮RAFI❯❯╚⏤⏤⏤╗",
        attachment: fs.createReadStream(tempPath)
      });
      fs.unlinkSync(tempPath);
    } catch (e) {
      message.reply("Image create করতে সমস্যা হয়েছে!");
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
};

async function makeLove7(one, two, outPath) {
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`);
  avone.circle();
  const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`);
  avtwo.circle();
  const img = await jimp.read("https://i.imgur.com/6HegGZG.jpeg");
  img.resize(1440, 1080)
     .composite(avone.resize(470, 470), 125, 210)
     .composite(avtwo.resize(470, 470), 800, 200);
  await img.writeAsync(outPath);
}
