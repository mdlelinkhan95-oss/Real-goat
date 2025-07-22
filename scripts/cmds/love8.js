const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "love8",
    version: "2.1",
    author: "OpenSource Edition",
    description: {
      en: "দুইজনের মাঝে ভালোবাসার হার মাপুন, ছবি সহ।"
    },
    category: "fun",
    guide: {
      en: "{pn} @User1 @User2 অথবা {pn} নাম1 নাম2"
    }
  },

  onStart: async function ({ message, args, event, usersData }) {
    let [uid1, uid2] = Object.keys(event.mentions);
    let name1, name2;

    // নাম সংগ্রহের লজিক
    if (uid1 && uid2) {
      name1 = await usersData.getName(uid1);
      name2 = await usersData.getName(uid2);
    } else if (args.length >= 2) {
      name1 = args[0];
      name2 = args[1];
    } else {
      return message.reply("দয়া করে দুইজনকে মেনশন করুন বা দুইটি নাম লিখুন ভালোবাসার হার জানার জন্য!");
    }

    // রেন্ডম প্রেমের মান (০-১০০)
    const lovePercent = Math.floor(Math.random() * 101);
    const blocksFilled = Math.floor(lovePercent / 10);
    const blocksEmpty = 10 - blocksFilled;

    // ইউনিক প্রেম বার স্টাইল (Unicode heart blocks variation)
    const filledBlock = "❤️";
    const emptyBlock = "🤍";

    const loveBar = filledBlock.repeat(blocksFilled) + emptyBlock.repeat(blocksEmpty);

    // ইউনিক পাঠ্য মন্তব্য
    let comment = "";
    if (lovePercent >= 95) comment = "✨ তোমাদের প্রেম আকাশ ছুঁয়ে যাচ্ছে!";
    else if (lovePercent >= 80) comment = "💘 চোখে চোখ পড়লেই বুঝে নেও প্রেম আছে!";
    else if (lovePercent >= 60) comment = "💞 প্রেম ধীরে ধীরে গড়ে উঠছে, সাবধানে আগাবেন!";
    else if (lovePercent >= 40) comment = "💔 ভালোবাসায় মাঝে মাঝে উত্থান-পতন থাকে!";
    else comment = "💔 হৃদয়ের টান কম, তবে অলৌকিক কিছু হতে পারে!";

    // মেসেজ ফরম্যাট (সাজানো)
    const result = `
━━━━━━━━━━━━━━━━━━━━━━━
      💖 𝓛𝓸𝓿𝓮 𝓜𝓮𝓽𝓮𝓻 💖

${name1} ❤️ ${name2}
━━━━━━━━━━━━━━━━━━━━━━━
[ ${loveBar} ]  ${lovePercent}%
━━━━━━━━━━━━━━━━━━━━━━━
💬  ${comment}
━━━━━━━━━━━━━━━━━━━━━━━
`;

    const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

    if (uid1 && uid2) {
      try {
        const [img1, img2] = await Promise.all([
          axios.get(`https://graph.facebook.com/${uid1}/picture?width=720&height=720&access_token=${token}`, { responseType: 'arraybuffer' }),
          axios.get(`https://graph.facebook.com/${uid2}/picture?width=720&height=720&access_token=${token}`, { responseType: 'arraybuffer' })
        ]);

        // unique temp file names
        const imgPath1 = path.join(__dirname, 'cache', `love_img1_${Date.now()}.jpg`);
        const imgPath2 = path.join(__dirname, 'cache', `love_img2_${Date.now()}.jpg`);

        fs.writeFileSync(imgPath1, Buffer.from(img1.data));
        fs.writeFileSync(imgPath2, Buffer.from(img2.data));

        // Send result with images
        await message.reply({
          body: result.trim(),
          attachment: [
            fs.createReadStream(imgPath1),
            fs.createReadStream(imgPath2)
          ]
        });

        // Clean up
        fs.unlinkSync(imgPath1);
        fs.unlinkSync(imgPath2);

      } catch (err) {
        console.error(err);
        return message.reply("ছবি আনতে সমস্যা হয়েছে, তবে প্রেমের বার্তা ঠিকই আছে!");
      }
    } else {
      await message.reply(result.trim());
    }
  }
};
