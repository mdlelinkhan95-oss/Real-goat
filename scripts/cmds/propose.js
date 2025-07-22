const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "propose",
    aliases: ["proposal"],
    version: "1.1",
    author: "Kivv × AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "@mention someone to propose",
    longDescription: "",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length) return message.reply("Please mention someone!");

    // temp ফাইল থেকে ফাইল safe রাখতে দিনের সময় ও senderID যোগ
    const tempPath = path.join(__dirname, "cache", `propose_${event.senderID}_${Date.now()}.png`);

    // এক বা একাধিক মেনশন: ১ হলে (sender + mention), ২ হলে (mention[1], mention[0])
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await makeProposeImg(one, two, tempPath);

      await message.reply({
        body: "「 Please be mine😍❤️ 」",
        attachment: fs.createReadStream(tempPath)
      });
      fs.unlinkSync(tempPath);
    } catch (e) {
      console.error("propose cmd error:", e);
      message.reply("Error creating propose image!");
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
};

async function makeProposeImg(one, two, outPath) {
  // ভ্যালিড এক্সেস টোকেন (এটা পাবলিক, সমস্যা নেই)
  const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`);
  avOne.circle();
  const avTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`);
  avTwo.circle();

  const bg = await jimp.read("https://i.ibb.co/RNBjSJk/image.jpg");
  bg.resize(760, 506)
    .composite(avOne.resize(90, 90), 210, 65)
    .composite(avTwo.resize(90, 90), 458, 105);

  await bg.writeAsync(outPath);
}
