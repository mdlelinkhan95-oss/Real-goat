const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "wanted2",
    aliases: ["chorgang"],
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "wanted frame for fun purpose",
    longDescription: "",
    category: "fun",
    guide: "{pn} @tag @tag"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length < 2) {
      message.reply("Tag your two friends to invite them in wanted frame");
      return;
    }

    // sender সহ ৩ জনের জন্য
    const [one, two] = mention;
    const three = event.senderID;

    try {
      const imagePath = await createWantedImage(one, two, three);
      await message.reply({
        body: "These guys are wanted",
        attachment: fs.createReadStream(imagePath)
      });
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error("Error while running wanted cmd:", error);
      await message.reply("❌ Image generate করতে সমস্যা হয়েছে!");
    }
  }
};

async function createWantedImage(one, two, three) {
  // নতুন access_token
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  // avater url
  const url1 = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`;
  const url2 = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`;
  const url3 = `https://graph.facebook.com/${three}/picture?width=512&height=512&access_token=${fbToken}`;

  // ছবিগুলো নাও
  const [avatarOne, avatarTwo, avatarThree] = await Promise.all([
    jimp.read(url1),
    jimp.read(url2),
    jimp.read(url3)
  ]);
  
  const bg = await jimp.read("https://i.ibb.co/7yPR6Xf/image.jpg");

  // সাইজ ও পজিশন অনুযায়ী বসানো
  bg.resize(2452, 1226)
    .composite(avatarOne.resize(405, 405), 206, 345)
    .composite(avatarTwo.resize(400, 400), 1830, 350)
    .composite(avatarThree.resize(450, 450), 1010, 315);

  // temp ফাইল অনন্য নামে
  const outPath = path.join(__dirname, "cache", `wanted_${one}_${two}_${three}.png`);
  await bg.writeAsync(outPath);
  return outPath;
}
