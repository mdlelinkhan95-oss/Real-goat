const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "love6",
    aliases: ["love6"],
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

    const tempPath = path.join(__dirname, "cache", `love2_${event.senderID}_${Date.now()}.png`);
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await createImage(one, two, tempPath, "https://i.imgur.com/h9goFi5.jpeg");
      await message.reply({
        body: "╔⏤⏤⏤╝❮❮𝗥𝗔𝗙𝗜❯❯╚⏤⏤⏤╗\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nতাকে ভূলে থাকার কারণ অনেক থাকলেও তার হওয়ার একটাই কারণ তার চোখের মায়া😚🫦\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n╔⏤⏤⏤╝❮❮𝗥𝗔𝗙𝗜❯❯╚⏤⏤⏤╗",
        attachment: fs.createReadStream(tempPath)
      });
      fs.unlinkSync(tempPath);
    } catch (err) {
      message.reply("ছবি তৈরি করতে সমস্যা হয়েছে!");
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  },
};

async function createImage(one, two, outPath, bgUrl) {
  const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`);
  avOne.circle();
  const avTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`);
  avTwo.circle();

  const bg = await jimp.read(bgUrl);
  bg.resize(1440, 1080)
    .composite(avOne.resize(470, 470), 125, 210)
    .composite(avTwo.resize(470, 470), 800, 200);

  await bg.writeAsync(outPath);
}
