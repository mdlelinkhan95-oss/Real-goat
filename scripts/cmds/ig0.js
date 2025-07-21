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
        "https://i.postimg.cc/m2WYvv51/129726529-216675409883467-7099287151035323348-n.jpg",
        "https://i.postimg.cc/k5H8fzS4/131479519-329495765215645-4589616289534954944-n.jpg",
        "https://i.postimg.cc/zvKnL7Vf/139412024-468783360810452-801530949372370445-n.jpg",
        "https://i.postimg.cc/VsC9HfDc/139572806-166504948200692-8142208774794964171-n.jpg",
        "https://i.postimg.cc/wBML5g7Z/139718212-447240470052046-3470444448848618187-n.jpg",
        "https://i.postimg.cc/sgw5ZvD5/140085207-438053364057578-1556485101997078968-n.jpg",
        "https://i.postimg.cc/CLCGSc3P/140088186-1889968201155219-7508719329963428011-n.jpg",
        "https://i.postimg.cc/2Sz464mz/140381014-743128666322087-3052012302502325706-n.jpg",
        "https://i.postimg.cc/brcnjn3f/140478950-3166000740167328-8628237311977849976-n.jpg",
        "https://i.postimg.cc/jSd7KtQ2/140575229-152102506543705-1681082115184473810-n.jpg"
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
	  
