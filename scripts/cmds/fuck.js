const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "fuck",
    aliases: ["chikai"],
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "18+",
    guide: "{pn} @mention",
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention.length) return message.reply("Please mention someone!");
    
    const sid = event.senderID;
    const tid = mention[0];

    try {
      const imgPath = await makeImage(sid, tid);
      await message.reply({
        body: "「 Harder daddy 🥵💦 」",
        attachment: fs.createReadStream(imgPath)
      });
      // কাজ শেষে টেম্প ফাইল ডিলিট
      fs.unlinkSync(imgPath);
    } catch (e) {
      console.error("fuck4 error:", e);
      message.reply("Image create করতে সমস্যা হয়েছে!");
    }
  }
};

async function makeImage(uid1, uid2) {
  const av1 = await jimp.read(`https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  av1.circle();
  const av2 = await jimp.read(`https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  av2.circle();
  const bg = await jimp.read("https://i.ibb.co/YpR7Bpv/image.jpg");

  // ছবির উপর দুই ইউজারের এভাটার বসানো
  bg.resize(639, 480)
    .composite(av1.resize(90, 90), 23, 320)
    .composite(av2.resize(100, 100), 110, 60);

  const outPath = __dirname + `/cache/fuck4_${uid1}_${uid2}.png`;
  await bg.writeAsync(outPath);
  return outPath;
}
