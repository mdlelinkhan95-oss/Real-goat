const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ig",
    version: "1.1.0",
    permission: 0,
    credits: "Mohammad Rahad (Fixed by AI)",
    description: "Send random Instagram images",
    prefix: true,
    category: "image",
    usages: "ig",
    cooldowns: 5,
  },

  onStart: async function({ api, event, message }) {
    try {
      const hi = ["🥵🥵🥵"];
      const know = hi[Math.floor(Math.random() * hi.length)];
      
      const link = [
        https://i.postimg.cc/m2WYvv51/129726529-216675409883467-7099287151035323348-n.jpg
      ];
      
      const randomLink = link[Math.floor(Math.random() * link.length)];
      
      // cache ফোল্ডার আছে কিনা তা নিশ্চিত করা
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      
      const imagePath = path.join(cacheDir, `ig_${Date.now()}.jpg`);
      
      // axios দিয়ে ইমেজ ডাউনলোড
      const imageResponse = await axios.get(randomLink, { responseType: "arraybuffer" });
      await fs.writeFile(imagePath, Buffer.from(imageResponse.data));
      
      // মেসেজ পাঠানো
      await message.reply({
        body: know,
        attachment: fs.createReadStream(imagePath)
      });
      
      // ডাউনলোড করা ফাইল ডিলিট করা
      await fs.unlink(imagePath);

    } catch (error) {
      console.error("ig command error:", error.message);
      message.reply("❌ দুঃখিত, এই মুহূর্তে ছবিটি আনা সম্ভব হচ্ছে না।");
    }
  }
};
	      
