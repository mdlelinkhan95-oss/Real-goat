const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "love3",
    aliases: ["love3"],
    version: "1.0",
    author: "MOHAMMAD-BADOL", // Do not remove credit
    countDown: 5,
    role: 0,
    shortDescription: "love dp",
    longDescription: "",
    category: "photo",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length)
      return message.reply("💚আপনি যাকে ভালবাসেন তাকে মেনশন করুন প্লিজ✅");

    // temp ফাইল Safe/Unique হিসেবে
    const outPath = path.join(__dirname, "cache", `love6_${event.senderID}_${Date.now()}.png`);
    // ১ জন mention হলে sender + mention, ২+ হলে প্রথম দুই mention
    const one = mention.length === 1 ? event.senderID : mention[1];
    const two = mention[0];

    try {
      await makeLove6(one, two, outPath);

      await message.reply({
        body: "╔⏤⏤⏤╝❮❮絵|◔Aizen❯❯╚⏤⏤⏤╗\n\n⋇⊶⊰❣⊱⊷⋇  ➳➳➳➳➳\n\n😦prem বড়লোকেরা করে আমি তো  গরিব..!!🥹🫶\n\n⋇⊶⊰❣⊱⊷⋇  ➳➳➳➳➳\n\n╔⏤⏤⏤╝❮❮絵|◔Aizen❯❯╚⏤⏤⏤╗",
        attachment: fs.createReadStream(outPath)
      });

      fs.unlinkSync(outPath); // temp ফাইল delete
    } catch (e) {
      console.error("love6 cmd error:", e);
      message.reply("Error creating image!");
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    }
  }
};

async function makeLove6(one, two, outPath) {
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`);
  avone.circle();
  const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`);
  avtwo.circle();
  const img = await jimp.read("https://i.imgur.com/nlZiKQu.jpeg");
  img.resize(1440, 1080)
     .composite(avone.resize(470, 470), 125, 210)
     .composite(avtwo.resize(470, 470), 800, 200);
  await img.writeAsync(outPath);
}
