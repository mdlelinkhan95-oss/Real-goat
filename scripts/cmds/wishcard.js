const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "wishcard",
    aliases: ["wc"],
    author: 'junjam × AceGun',
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: 'Make a wishcard',
    },
    guide: { en: '{p}wishcard [text1 - text2]' }
  },

  circle: async function (path) {
    const { loadImage, createCanvas } = require("canvas");
    let img = await loadImage(path);
    let canvas = createCanvas(img.width, img.height);
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toBuffer();
  },

  onStart: async function ({ api, event, args }) {
    const { loadImage, createCanvas, registerFont } = require("canvas");

    // (Optional) Custom font আগেই ইন্সটল বা ডাউনলোড করে /cache-এ রাখলে:
    // registerFont(__dirname+'/cache/Manrope.ttf', { family: 'Manrope' });

    try {
      const senderID = event.senderID;
      const pathImg = __dirname + `/cache/wishcard_${senderID}.png`;
      const pathAva = __dirname + `/cache/avtuser_${senderID}.png`;

      const text = args.join(" ");
      if (!text.includes(" - ")) return api.sendMessage(
        '💢 Please enter the correct format: wishcard [text1 - text2]', event.threadID, event.messageID);

      const text1 = text.substr(0, text.indexOf(' - ')).trim();
      const text2 = text.split(" - ").pop().trim();
      if (!text1 || !text2) return api.sendMessage(
        '💢 Please enter in format: wishcard [text1 - text2]', event.threadID, event.messageID);

      // Download user's avatar
      const { data: Avatar } = await axios.get(
        `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

      // Make a circle avatar
      const avatarBuffer = await module.exports.circle(pathAva);

      // Download template
      const bgLink = "https://i.ibb.co/cCpB1sQ/Ph-i-b-a-trung-thu.png";
      const { data: getWanted } = await axios.get(bgLink, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

      let baseImage = await loadImage(pathImg);
      let baseAva = await loadImage(avatarBuffer);

      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      // Draw BG and Avatar
      ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
      ctx.drawImage(baseAva, 820, 315, 283, 283);

      // Draw texts
      ctx.font = "bold 70px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(text1, 965, 715);

      ctx.font = "55px sans-serif";
      ctx.fillText(text2, 965, 800);

      // Out!
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.unlinkSync(pathAva);

      return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        event.messageID
      );
    } catch (e) {
      console.error("wishcard error:", e);
      return api.sendMessage("❌ Wishcard create করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
    }
  }
};
