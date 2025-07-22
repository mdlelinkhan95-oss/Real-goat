module.exports = {
  config: {
    name: "girl2",
    version: "1.0",
    author: "Doru fix by kivv",
    countDown: 5,
    role: 2,
    shortDescription: "send you pic of pussy",
    longDescription: "sends u pic of girls pussy",
    category: "18+",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const links = [
      "https://i.postimg.cc/wTJNSC1G/E-B9ea-WQAAst-Yg.jpg",
      "https://i.postimg.cc/sgrWyTSD/E-B9eb-AWUAINyt-B.jpg",
      "https://i.postimg.cc/TYcj48LJ/E02i-P-q-XIAE62tu.jpg",
      "https://i.postimg.cc/MpK0ks12/E02i-P-w-WYAEbvgg.jpg",
      "https://i.postimg.cc/k5LWbqzq/E02i-P-x-XIAAy-K2k.jpg",
      // ...তালিকার বাকি লিংকগুলো এখানেই রাখো...
      "https://i.postimg.cc/kGxnc3c0/E99pfbs-Vg-AQd5kt.jpg"
    ];
    // Random লিংক নাও
    const img = links[Math.floor(Math.random() * links.length)];
    // GoatBot-এর জন্য async send
    await message.send({
      body: "🔞 𝙂𝙞𝙧𝙡 𝙋𝙪𝙨𝙨𝙮 𝙋𝙞𝙘𝙨",
      attachment: await global.utils.getStreamFromURL(img)
    });
  }
};
