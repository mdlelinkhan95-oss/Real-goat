const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["robot", "sim"],
    version: "2.0.0",
    author: "Perplexity AI",
    role: 0,
    description: "Talk with the bot using SimSimi API.",
    category: "talk",
    countDown: 3,
    guide: {
      en: "{pn} <your_message>",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");

    if (!text) {
      return api.sendMessage("👋 Hello there! What do you want to talk about?", threadID, messageID);
    }

    try {
      const response = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
        params: {
          text: text,
          lc: "bn" // Language code (bn for Bengali)
        }
      });

      const reply = response.data.success;
      if (reply) {
        api.sendMessage(reply, threadID, messageID);
      } else {
        api.sendMessage("Sorry, I don't know how to respond to that. 🥺", threadID, messageID);
      }
    } catch (error) {
      console.error("SimSimi API Error:", error);
      api.sendMessage("❌ An error occurred while talking to the bot.", threadID, messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;

    // Keywords to trigger the bot
    const keywords = ["bot", "sim", "robot", "বট"];

    // Check if the message starts with any keyword
    const lowerBody = body.toLowerCase();
    const triggerKeyword = keywords.find(keyword => lowerBody.startsWith(keyword));

    if (triggerKeyword) {
      const text = body.slice(triggerKeyword.length).trim();
      
      if (!text) return; // Don't reply if there's no message after the keyword

      try {
        const response = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
          params: {
            text: text,
            lc: "bn"
          }
        });

        const reply = response.data.success;
        if (reply) {
          api.sendMessage(reply, threadID, messageID);
        }
      } catch (error) {
        // Do nothing on error to avoid spamming
        console.error("SimSimi onChat Error:", error);
      }
    }
  }
};
  
