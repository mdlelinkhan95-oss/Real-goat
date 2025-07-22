const axios = require('axios');

module.exports = {
  config: {
    name: "anivid",
    version: "5.1",
    author: "OpenAI (Modified by Perplexity)",
    countDown: 20,
    role: 0,
    shortDescription: "Get random anime video",
    longDescription: "Provides a random high-quality anime edit video without needing any input.",
    category: "anime",
    guide: {
        en: "{pn} (Just type the command, no arguments)"
    },
  },

  onStart: async function ({ api, event, message, args }) {
    if (args.length > 0) {
      return message.reply("❌ This command doesn't accept any arguments!\nFor specific anime search, use: `/anisearch <anime name>`");
    }

    const loadingMessage = await message.reply("🌸 Finding a spectacular random anime edit for you... ✨");
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const searchTerms = ["anime edit", "anime amv", "anime sad edit", "anime fight amv", "anime compilation"];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(randomTerm)}`);
      const videos = response.data;

      if (!videos || videos.length === 0) {
          api.unsendMessage(loadingMessage.messageID);
          return message.reply("❌ Couldn't find any random anime videos right now. Please try again!");
      }

      const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
      if (!selectedVideo || !selectedVideo.videoUrl) {
          api.unsendMessage(loadingMessage.messageID);
          return message.reply('❌ Error: Incomplete video data received. Please try again!');
      }

      const videoStream = (await axios.get(selectedVideo.videoUrl, { responseType: 'stream' })).data;
      
      await message.reply({
        body: `╔═════ ≪ °❈° ≫ ═════╗\n  ✨ 𝗥𝗔𝗡𝗗𝗢𝗠 𝗔𝗡𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢 ✨\n╚═════ ≪ °❈° ≫ ═════╝\n\nEnjoy this epic anime moment! 🎬`,
        attachment: videoStream,
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (error) {
      console.error("Anivid Error:", error);
      await message.reply("❌ An unexpected error occurred while fetching the video. Please try again later.");
    } finally {
      api.unsendMessage(loadingMessage.messageID).catch(e => {});
    }
  }
};
        
