const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

module.exports = {
  config: {
    name: "anilogo",
    aliases: ["alogo"],
    version: "1.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Generate anime-style logo",
    longDescription: "Generate an anime-style logo with your text and a selected style 🎨",
    category: "image",
    guide: {
      en: "{pn} <text> <style>\n" +
           "Style must be a number between 1 and 5\n" +
           "Example: {pn} Hridoy 2"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    const { threadID, messageID } = event;
    
    try {
      if (args.length < 2) {
        return message.reply("Please provide both text and style number (1-5)\nExample: /anilogo YourName 2");
      }

      const style = args[args.length - 1];
      const text = args.slice(0, -1).join(" ").trim();

      if (!text) {
        return message.reply("Please provide text for the logo\nExample: /anilogo YourName 2");
      }

      if (!/^[1-5]$/.test(style)) {
        return message.reply("Style must be a number between 1 and 5\nExample: /anilogo YourName 2");
      }

      // API call
      const apiUrl = `https://nexalo-api.vercel.app/api/anime-logo-generator?text=${encodeURIComponent(text)}&number=${style}`;
      const response = await axios.get(apiUrl, { timeout: 30000 });

      const result = response.data;

      if (!result.status || !result.url) {
        throw new Error(result.message || "Failed to generate anime logo");
      }

      const imageUrl = result.url;

      // Download image
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'stream',
        timeout: 30000
      });

      const contentType = imageResponse.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error("API response is not an image");
      }

      // Create cache directory
      const tempDir = path.join(__dirname, '..', '..', 'cache');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const fileName = `anilogo_${crypto.randomBytes(8).toString('hex')}.png`;
      const filePath = path.join(tempDir, fileName);

      // Save image
      const writer = fs.createWriteStream(filePath);
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Check file size
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error("Downloaded anime logo image is empty");
      }

      // Send message with image
      await message.reply({
        body: `🎨 Anime logo generated for "${text}" (Style ${style})!`,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error("Anilogo command error:", error);
      return message.reply(`⚠️ Error: ${error.message}`);
    }
  }
};
        
