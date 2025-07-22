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
    // ভিডিও লিংকগুলো এখানে দাও (Google Drive: anyone with link can download)
    const videos = [
      "https://drive.google.com/uc?id=10r9JSdTGf1JKrdQG7vxXlH0GqM-hgWHi", "https://drive.google.com/uc?id=10hEt13pTM_0Og-DjlTE65FkzvJJk-cEp", "https://drive.google.com/uc?id=111exlB5om3SqlAqaaI-hGJ0iY6_enxlW", "https://drive.google.com/uc?id=10xNg0Cyo3jOY1XZOUOBvc6EUwZexY98k", "https://drive.google.com/uc?id=10eFm6s4v93laHKfGCAF2Gi83onHaNkfH", "https://drive.google.com/uc?id=10zESTM0ZPzaLjkBKqx1xTAYkjBujM11Z", "https://drive.google.com/uc?id=10yrc2V8wsarQoeetdbHhVpIh1UBZsRMf", "https://drive.google.com/uc?id=116RRysbUPupsaqcKaLDF8s4w_3dnyoLP", "https://drive.google.com/uc?id=10lsWH5OU92Ic58T5mhWcYlXaXriYqTgl", "https://drive.google.com/uc?id=1zNjTv0vEW8wQ8W9VWqA7kOlQby6HuGwW", "https://drive.google.com/uc?id=1zbh0feeFRrYu7o0HIP-Cqaj0uGktyl5C", "https://drive.google.com/uc?id=1zhwIPt-MkC39egPxq35CmYrSR7MwteDC", "https://drive.google.com/uc?id=1znDXaoXG-L2aA-ex4ubuI_hT-MKGhFhV", "https://drive.google.com/uc?id=1zXMpg1kra62dcfjw7KSR9OY_plECySwI", "https://drive.google.com/uc?id=1znQfHdxzmTl1y-bHZGgjf30loyuZ2P26", "https://drive.google.com/uc?id=1zVxKJPB8HbB3JIdTqPhl_oeFVN9Z8R6k", "https://drive.google.com/uc?id=1zPikuNIik8TzXvNPJFZ9xC1v_37auDcl", "https://drive.google.com/uc?id=1zNJMEqBOFceTbukwJCiukZgm_gFLAyQV", "https://drive.google.com/uc?id=1zhwIPt-MkC39egPxq35CmYrSR7MwteDC"
      // ... আরো যোগ করতে পারো ...
    ];

    // ভিডিও লিস্ট খালি হলে ফেইল
    if (videos.length === 0) {
      return message.reply("❌ ভিডিও লিস্ট খালি! লিংকগুলো বসাও।");
    }

    // র‌্যান্ডম লিংক নেয়া
    const randomUrl = videos[Math.floor(Math.random() * videos.length)];
    const filePath = path.join(__dirname, "cache", "hotvideo.mp4");

    try {
      // ভিডিও ডাউনলোড (Google Drive: file must be public, otherwise fail)
      const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
      await fs.ensureDir(path.join(__dirname, "cache"));
      await fs.writeFile(filePath, res.data);

      // পাঠাও (ডাউনলোড শেষে ফাইল ডিলিট)
      await api.sendMessage({
        body: "╔══❖•MR᭄﹅ RAFI﹅ メꪜ•❖══╗\n\n【• HOT-VIDEO•】\n\n╚══❖•Rafi-BOT•❖══╝",
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlink(filePath, () => {}), event.messageID);

    } catch (err) {
      // মোস্ট কমন: গুগল ড্রাইভ ফাইল dead/private, বা rate limit
      console.error("Video Error:", err.message);
      message.reply(
        "❌ ভিডিও পাওয়া যায়নি (ডাউনলোড/শেয়ার করা যাচ্ছে না)।\n\nসম্ভাব্য কারণঃ\n- Google Drive file dead/private\n- Rate limit/Quota exceeded\n- ভিডিও লিংক আসলেই ভেঙ্গে গেছে\n\nঅনুগ্রহ করে নতুন বা working লিংক বসাও!",
        event.threadID,
        event.messageID
      );
    }
  }
};
        
