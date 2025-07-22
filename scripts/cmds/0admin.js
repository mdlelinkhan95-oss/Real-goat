const axios = require("axios");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    permission: 0,
    credits: "nayan",
    prefix: true,
    description: "Shows admin info with photo (no cache)",
    category: "prefix",
    usages: "",
    cooldowns: 5
  },

  onStart: async function({ message }) {
    try {
      const info = `
--------------------------------------------
𝐍𝐚𝐦𝐞        : R A F Iメ
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : RAFI 卝 চৌধুরীヅ
𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : 𝐈𝐬𝐥𝐚𝐦
𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: (Rangpur,)
𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝗗𝗵𝗮𝗸𝗮,
𝐆𝐞𝐧𝐝𝐞𝐫.   : (𝐌𝐚𝐥𝐞)
𝐀𝐠𝐞           : (𝟏𝟖+)
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : (mingle)
𝐖𝐨𝐫𝐤        : (𝐒𝐭𝐮𝐝𝐞𝐧𝐭)
𝐆𝐦𝐚𝐢𝐥       : (private)
𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: (private)
𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦  : t.me/R_A_F_I_Official
insta  : (private)
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/x4x.rafi`;

      // এখানে Imgur লিংক দিন
      const imgUrl = "https://i.imgur.com/iVxN5Z8.jpeg";
    "https://i.imgur.com/iVxN5Z8.jpeg";
      

      const res = await axios.get(imgUrl, { responseType: "stream", headers: { "User-Agent": "Mozilla/5.0" } });

      await message.reply({
        body: info,
        attachment: res.data
      });

    } catch (err) {
      console.error("Admin info CMD error:", err.message);
      message.reply("❌ ইমেজ পাঠানো যাচ্ছে না, তথ্য ঠিক আছে।");
    }
  }
};
