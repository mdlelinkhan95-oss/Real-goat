const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    permission: 0,
    credits: "nayan",
    prefix: true,
    description: "Shows admin info with photo",
    category: "prefix",
    usages: "",
    cooldowns: 5,
  },

  onStart: async function({ api, event, message }) {
    try {
      const start = process.uptime();
      const hours = Math.floor(start / 3600);
      const minutes = Math.floor((start % 3600) / 60);
      const seconds = Math.floor(start % 60);
      const timeString = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

      const info = `
--------------------------------------------
𝐍𝐚𝐦𝐞        : 𝗔𝗹𝗶𝗳 𝗛𝗼𝘀𝘀𝗼𝗻
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : 𝗔𝗹𝗶𝗳 𝗛𝗼𝘀𝘀𝗼𝗻
𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : 𝐈𝐬𝐥𝐚𝐦
𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: (𝐃𝐡𝐚𝐤𝐚,)
𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝗗𝗵𝗮𝗸𝗮 𝗚𝗮𝘇𝗶𝗽𝘂𝗿,
𝐆𝐞𝐧𝐝𝐞𝐫.   : (𝐌𝐚𝐥𝐞)
𝐀𝐠𝐞           : (𝟏𝟖+)
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : (𝐒𝐢𝐧𝐠𝐥𝐞)
𝐖𝐨𝐫𝐤        : (𝐒𝐭𝐮𝐝𝐞𝐧𝐭)
𝐆𝐦𝐚𝐢𝐥       : alifhosson5@gmail.com
𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: wa.me/+8801615623399
𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦  : t.me/alifhosson
𝐌𝐲 𝐁𝐢𝐨   : https://bio.link/alifhosson
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/Alifhosson.xxx`;

      // ফোল্ডার রেডি করো
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const imgPath = path.join(cacheDir, "1.png");

      // 1. Modern Facebook ID/Profile Image fetch, fallback if not found
      const imgUrl = "https://graph.facebook.com/100075421394195/picture?height=720&width=720";
      // const imgUrl = "https://pplx-res.cloudinary.com/image/upload/v1753004910/user_uploads/16172130/2c593b26-2174-4fd2-b713-7031e4cf5cc0/1000263194.jpg"; // fallback link

      try {
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        await fs.writeFile(imgPath, Buffer.from(res.data, "binary"));
      } catch (e) {
        // fallback image দিন এখানে
        await fs.copyFile("path/to/backup_local_admin_img.png", imgPath);
      }

      await message.reply({
        body: info,
        attachment: fs.createReadStream(imgPath)
      });

      setTimeout(() => fs.unlink(imgPath, () => {}), 5000);

    } catch (err) {
      console.error("Admin info CMD error:", err.message);
      message.reply("❌ ইমেজ পাঠানো যাচ্ছে না, তথ্য ঠিক আছে।");
    }
  }
};
	      
