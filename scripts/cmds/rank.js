const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

module.exports = {
  config: {
    name: "rank",
    version: "2.0.0",
    author: "Clarence-DK (God Mode by Perplexity)",
    countDown: 5,
    role: 0,
    shortDescription: "Show your exp/level rank in group",
    longDescription: "Display your current rank, level, and exp in the group with a stylish image card",
    category: "group",
    guide: {
      en: "{pn} [@mention or reply]\nSee your or others' rank card"
    }
  },

  makeRankCard: async function(data, bgLink) {
    const Canvas = require("canvas");
    const request = require("node-superfetch");
    const jimp = require("jimp");
    const __dirname = path.dirname(__filename);
    const tempDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const { id, name, rank, level, expCurrent, expNextLevel } = data;
    const fontDir = path.join(__dirname, "cache");

    Canvas.registerFont(fontDir + "/regular-font.ttf", {
      family: "Manrope", weight: "regular", style: "normal"
    });
    Canvas.registerFont(fontDir + "/bold-font.ttf", {
      family: "Manrope", weight: "bold", style: "normal"
    });

    const tmpBg = path.join(tempDir, `rankbg_${id}.png`);
    const bgRes = await axios.get(bgLink, { responseType: "arraybuffer" });
    fs.writeFileSync(tmpBg, Buffer.from(bgRes.data, "binary"));

    let avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await jimp.read(avatar.body);
    avatar.circle();
    const tmpAvt = path.join(tempDir, `avt_${id}.png`);
    await avatar.writeAsync(tmpAvt);

    const baseImage = await Canvas.loadImage(tmpBg);
    const avatarImage = await Canvas.loadImage(tmpAvt);

    const expWidth = Math.min((expCurrent * 615) / expNextLevel, 615 - 18.5);
    const canvas = Canvas.createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarImage, 45, 50, 180, 180);

    ctx.font = `bold 36px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "start";
    ctx.fillText(name, 270, 164);

    ctx.font = `bold 35px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "end";
    ctx.fillText(level, 555, 82);
    ctx.fillText("Level:", 555 - ctx.measureText(level).width - 10, 82);

    ctx.font = `bold 32px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.fillText(`#${rank}`, 665, 82);

    ctx.font = `bold 26px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "start";
    ctx.fillText(`/ ${expNextLevel}`, 710 + ctx.measureText(expCurrent).width + 10, 164);
    ctx.fillText(`${expCurrent}`, 710, 164);

    ctx.beginPath();
    ctx.fillStyle = getRandomColor();
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
    ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    const resultPath = path.join(tempDir, `rankcard_${id}.png`);
    fs.writeFileSync(resultPath, canvas.toBuffer());
    fs.unlinkSync(tmpBg);
    fs.unlinkSync(tmpAvt);

    return resultPath;
  },

  expToLevel: function(point) {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
  },

  levelToExp: function(level) {
    if (level <= 0) return 0;
    return 3 * level * (level - 1);
  },

  getInfo: async function(uid, Currencies) {
    let point = (await Currencies.getData(uid))?.exp || 0;
    const level = this.expToLevel(point);
    const expCurrent = point - this.levelToExp(level);
    const expNextLevel = this.levelToExp(level + 1) - this.levelToExp(level);
    return { level, expCurrent, expNextLevel };
  },

  onStart: async function({ event, api, args, Currencies, Users }) {
    try {
      // === ইমজুর ব্যাকগ্রাউন্ড লিংক র‌্যান্ডমভাবে নিচে ===
      const bgLinks = [
        "https://i.imgur.com/W68YYhI.jpeg",
        "https://i.imgur.com/jxdanWZ.jpeg"
      ];
      const bgLink = bgLinks[Math.floor(Math.random() * bgLinks.length)];

      const threadID = event.threadID;
      const mentions = Object.keys(event.mentions);

      let dataAll = await Currencies.getAll(["userID", "exp"]);
      dataAll.sort((a, b) => b.exp - a.exp);

      const buildAndSend = async (uid) => {
        const name = global.data.userName.get(uid) || await Users.getNameUser(uid);
        const rank = dataAll.findIndex(item => String(item.userID) == String(uid)) + 1;
        if (!rank) return api.sendMessage("User not found in ranking database.", threadID);
        const pointInfo = await this.getInfo(uid, Currencies);
        const cardPath = await this.makeRankCard({ id: uid, name, rank, ...pointInfo }, bgLink);
        await api.setMessageReaction("✅", event.messageID, () => {}, true);
        await api.sendMessage(
          {
            body: `Name: ${name}\nTop: ${rank} \nLevel: ${pointInfo.level}\nExp: ${pointInfo.expCurrent} / ${pointInfo.expNextLevel}`,
            attachment: fs.createReadStream(cardPath)
          },
          threadID,
          () => fs.unlinkSync(cardPath),
          event.messageID
        );
      };

      if (!args.length && !mentions.length) {
        await buildAndSend(event.senderID);
      } else if (mentions.length === 1) {
        await buildAndSend(mentions[0]);
      } else if (mentions.length > 1) {
        for (const uid of mentions) {
          await buildAndSend(uid);
        }
      }
    } catch (err) {
      console.error("Rank error:", err);
      api.sendMessage("❌ Error generating rank card. Please try again later.", event.threadID, event.messageID);
    }
  }
};
	    
