const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "spiderman",
    aliases: ["spiderman"],
    version: "1.0",
    author: "zach",
    countDown: 5,
    role: 0,
    shortDescription: "memes",
    longDescription: "",
    category: "photo",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length) return message.reply("Please mention someone!");

    // ফাইল ক্লিন করার জন্য temp নাম করা হচ্ছে
    const tempPath = path.join(__dirname, "cache", `spiderman_${event.senderID}_${Date.now()}.png`);

    // ১ জন মেনশন - sender + mention
    // ২ বা তার বেশি - প্রথম দুইজন
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await makeSpiderImg(one, two, tempPath);

      await message.reply({
        body: mention.length === 1 ? "it's him🕸️" : "he is not me🕸️",
        attachment: fs.createReadStream(tempPath)
      });

      fs.unlinkSync(tempPath);
    } catch (e) {
      console.error("spiderman cmd error:", e);
      message.reply("Error creating spiderman meme!");
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
};

async function makeSpiderImg(one, two, outPath) {
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`);
  avOne.circle();
  const avTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`);
  avTwo.circle();

  const img = await jimp.read("https://i.imgur
