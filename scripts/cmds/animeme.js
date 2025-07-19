const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "animeme",
    aliases: ["animeirl"],
    version: "2.1.0",
    author: "Perplexity AI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get random anime meme (animemes or anime_irl)"
    },
    longDescription: {
      en: "Gets a random anime meme from meme-api.com"
    },
    category: "fun",
    guide: {
      en: "{pn} - Random anime meme"
    }
  },

  onStart: async function({ message }) {
    // দুই API থেকে একটিকে random নিও
    const apis = [
      "https://meme-api.com/gimme/animemes",
      "https://meme-api.com/gimme/anime_irl"
    ];
    const apiEndpoint = apis[Math.floor(Math.random() * apis.length)];

    try {
      const res = await axios.get(apiEndpoint, { timeout: 10000 });
      if (!res.data.url) throw new Error("No meme image found!");
      const { title, url: imgUrl, postLink, author } = res.data;

      // ফাইল এক্সটেনশন guess
      let ext = ".jpg";
      if (imgUrl.endsWith(".png")) ext = ".png";
      else if (imgUrl.endsWith(".gif")) ext = ".gif";
      else if (imgUrl.endsWith(".webp")) ext = ".webp";

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const filePath = path.join(cacheDir, `animeme_${Date.now()}${ext}`);

      // ডাউনলোড ইমেজ
      const imgFile = await axios.get(imgUrl, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(imgFile.data, "binary"));

      // মেসেজ reply
      await message.reply({
        body: `🎭 Anime Meme\n${title || ""}\n🔗 ${postLink || ""}\n👤 ${author ? `by u/${author}` : ""}`,
        attachment: fs.createReadStream(filePath)
      });

      // ক্লিনআপ
      fs.unlink(filePath, () => {});

    } catch (err) {
      console.error("animeme API error:", err.message);
      await message.reply("❌ Couldn't fetch an anime meme from the API. Try again later.");
    }
  }
};
        
