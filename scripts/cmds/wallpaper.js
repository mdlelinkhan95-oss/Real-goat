const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wallpaper",
    aliases: ["wl"],
    version: "1.1",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    shortDescription: { en: "get wallpaper" },
    longDescription: { en: "get wallpaper" },
    category: "tools",
    guide: { en: "{p}wallpaper nature" }
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      api.sendMessage("Please provide a search query. উদাহরণ: /wl nature", event.threadID, event.messageID);
      return;
    }

    const apiKey = "51431602-1fd83a7cd8437c426ee1edd77";
    const query = encodeURIComponent(args.join(" "));
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=10`;

    try {
      const response = await axios.get(apiUrl);
      const wallpapers = response.data.hits.filter(wallpaper => {
        const ext = path.extname(wallpaper.largeImageURL).toLowerCase();
        return ext === ".jpg" || ext === ".png";
      });

      if (!wallpapers.length) {
        api.sendMessage("No wallpapers found for the given query.", event.threadID, event.messageID);
        return;
      }

      let streams = [];
      let i = 0;

      for (const wallpaper of wallpapers) {
        if (i >= 5) break; // একবারে বেশি না পাঠাতে চাইলে, চাইলে সংখ্যা বাড়াও
        const ext = path.extname(wallpaper.largeImageURL).toLowerCase();
        const imgPath = path.join(__dirname, `cache/wallpaper_${Date.now()}_${i}${ext}`);

        try {
          const imgRes = await axios.get(wallpaper.largeImageURL, { responseType: "arraybuffer" });
          fs.writeFileSync(imgPath, imgRes.data);
          streams.push(fs.createReadStream(imgPath).on("end", () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          }));
          i++;
        } catch (err) {
          console.error("Image download error:", err);
        }
      }

      if (streams.length) {
        api.sendMessage({
          body: `📷 Random Wallpaper Results:`,
          attachment: streams
        }, event.threadID, event.messageID);
      } else {
        api.sendMessage("❌ Couldn't fetch/download any wallpapers.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching wallpapers.", event.threadID, event.messageID);
    }
  }
};
