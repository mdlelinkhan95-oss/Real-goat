const axios = require('axios');

module.exports = {
  config: {
    name: "anisearch",
    version: "1.1",
    author: "Vex_kshitiz (Modified by Perplexity)",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Get anime edit video",
    },
    longDescription: {
      en: "Search for specific anime edit videos.",
    },
    category: "media",
    guide: {
      en: "{p}{n} [anime name]",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(' ');
    if (!query) {
      return message.reply("Please provide an anime name to search for. Example: /anisearch Naruto");
    }

    const loadingMessage = await message.reply("⏳ Searching for your anime edit... Please wait!");
    api.setMessageReaction("✨", event.messageID, (err) => {}, true);
    
    try {
      const modifiedQuery = `${query} anime edit`;
      const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(modifiedQuery)}`);
      const videos = response.data;

      if (!videos || videos.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return message.reply(`❌ No anime edits found for "${query}".`);
      }

      const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl) {
        api.unsendMessage(loadingMessage.messageID);
        return message.reply('❌ Error: Video data is incomplete. Please try again.');
      }

      const videoStream = (await axios.get(videoUrl, { responseType: 'stream' })).data;
      
      await message.reply({
        body: `✨ Here is your anime edit for: **${query}**`,
        attachment: videoStream,
      });

      api.unsendMessage(loadingMessage.messageID).catch(e => console.error(e));

    } catch (error) {
      console.error(error);
      api.unsendMessage(loadingMessage.messageID).catch(e => console.error(e));
      await message.reply('❌ An error occurred while processing the video. The API might be down.');
    }
  },
};
                                              
