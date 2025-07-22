const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hot",
    version: "1.0.1",
    role: 0,
    author: "MAHABUB RAHMAN",
    description: "get 18+ video",
    category: "media",
    usages: "horny item video",
    countDown: 5
  },

  onStart: async ({ api, event, message }) => {
    const videos = [
      "https://drive.google.com/uc?id=10r9JSdTGf1JKrdQG7vxXlH0GqM-hgWHi", "https://drive.google.com/uc?id=10hEt13pTM_0Og-DjlTE65FkzvJJk-cEp", "https://drive.google.com/uc?id=111exlB5om3SqlAqaaI-hGJ0iY6_enxlW", "https://drive.google.com/uc?id=10xNg0Cyo3jOY1XZOUOBvc6EUwZexY98k", "https://drive.google.com/uc?id=10eFm6s4v93laHKfGCAF2Gi83onHaNkfH", "https://drive.google.com/uc?id=10zESTM0ZPzaLjkBKqx1xTAYkjBujM11Z", "https://drive.google.com/uc?id=10yrc2V8wsarQoeetdbHhVpIh1UBZsRMf", "https://drive.google.com/uc?id=116RRysbUPupsaqcKaLDF8s4w_3dnyoLP", "https://drive.google.com/uc?id=10lsWH5OU92Ic58T5mhWcYlXaXriYqTgl", "https://drive.google.com/uc?id=1zNjTv0vEW8wQ8W9VWqA7kOlQby6HuGwW", "https://drive.google.com/uc?id=1zbh0feeFRrYu7o0HIP-Cqaj0uGktyl5C", "https://drive.google.com/uc?id=1zhwIPt-MkC39egPxq35CmYrSR7MwteDC", "https://drive.google.com/uc?id=1znDXaoXG-L2aA-ex4ubuI_hT-MKGhFhV", "https://drive.google.com/uc?id=1zXMpg1kra62dcfjw7KSR9OY_plECySwI", "https://drive.google.com/uc?id=1znQfHdxzmTl1y-bHZGgjf30loyuZ2P26", "https://drive.google.com/uc?id=1zVxKJPB8HbB3JIdTqPhl_oeFVN9Z8R6k", "https://drive.google.com/uc?id=1zPikuNIik8TzXvNPJFZ9xC1v_37auDcl", "https://drive.google.com/uc?id=1zNJMEqBOFceTbukwJCiukZgm_gFLAyQV", "https://drive.google.com/uc?id=1zhwIPt-MkC39egPxq35CmYrSR7MwteDC"
      // ...more
    ];

    const randomUrl = videos[Math.floor(Math.random() * videos.length)];
    const filePath = path.join(__dirname, "cache", "hotvideo.mp4");

    try {
      // ডাউনলোড করো
      const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
      await fs.ensureDir(path.join(__dirname, "cache"));
      await fs.writeFile(filePath, res.data);

      await api.sendMessage({
        body: "╔══❖•MR᭄﹅ RAFI﹅ メꪜ•❖══╗\n\n【• HOT-VIDEO•】\n\n╚══❖•Rafi-BOT•❖══╝",
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlink(filePath, () => {}), event.messageID);

    } catch (err) {
      console.error("Video Error:", err.message);
      api.sendMessage(
        "❌ ভিডিও ডাউনলোড/শেয়ার করা যাচ্ছে না! এই লিংক dead/private বা Google Drive limit হয়ে গেছে। নতুন লিংক চেষ্টা করুন।",
        event.threadID,
        event.messageID
      );
    }
  }
};
          
