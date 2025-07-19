const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "admin",
    aliases: [],
    version: "1.0.1",
    author: "Abdulla Rahaman",
    countDown: 1,
    role: 0,
    shortDescription: "Shows admin info with photo",
    longDescription: "Shows developer/admin bio with photo attachment",
    category: "info",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const links = [
      "https://i.imgur.com/glAV4Jf.jpeg",
      "https://i.imgur.com/rdR9VC8.jpeg"
    ];
    const imgUrl = links[Math.floor(Math.random() * links.length)];
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const imgPath = path.join(cacheDir, `admin_${Date.now()}.jpg`);
    try {
      const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
      await fs.writeFile(imgPath, Buffer.from(res.data, "binary"));
      const info = 
`𝗗𝗢 𝗡𝗢𝗧 𝗧𝗥𝗨𝗦𝗧 𝗧𝗛𝗘 𝗕𝗢𝗧 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥
------------------------------------------------
𝗡𝗮𝗺𝗲           : 𝘼𝙗𝙙𝙪𝙡𝙡𝙖 𝙍𝙖𝙝𝙖𝙢𝙖𝙣
𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸       : 𝘼𝙗𝙙𝙪𝙡𝙡𝙖 𝙍𝙖𝙝𝙖𝙢𝙖𝙣
𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻        : (𝗜𝘀𝗹𝗮𝗺)
𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : (𝗗𝗵𝗮𝗸𝗮)
𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀   : 𝘿𝙝𝙖𝙠𝙖, 𝘽𝙖𝙣𝙜𝙡𝙖𝙙𝙚𝙨𝙝
𝗚𝗲𝗻𝗱𝗲𝗿           : (𝗠𝗮𝗹𝗲)
𝗔𝗴𝗲                : (20)
𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽     : (𝗦𝗶𝗻𝗴𝗹𝗲)
𝗪𝗼𝗿𝗸               : 𝙎𝙩𝙪𝙙𝙮
𝗚𝗺𝗮𝗶𝗹              : rahamanabdulla653@gmail.com
𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽           : wa.me/+8801864600368
𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺           : t.me/abdullarahaman49
𝗙𝗯 𝗹𝗶𝗻𝗸            : https://www.facebook.com/abdullah.rahaman.49`;

      await message.reply({
        body: info,
        attachment: fs.createReadStream(imgPath)
      });
      setTimeout(() => fs.unlink(imgPath, () => {}), 5000);
    } catch (err) {
      await message.reply(`❌ Could not fetch admin image.\n${err.message}`);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
  }
};
	      
