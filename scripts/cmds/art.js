const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "art",
    version: "1.0.0",
    author: "Hridoy",
    countDown: 10,
    role: 0,
    shortDescription: "Generate AI art",
    longDescription: "Generate AI art based on a user prompt using advanced AI technology",
    category: "ai",
    guide: {
      en: "{pn} <prompt>\nGenerate AI art with the given prompt\nExample: {pn} futuristic city"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    const { threadID, messageID } = event;
    
    try {
      if (!args[0]) {
        return message.reply("❌ Please provide a prompt for AI art generation\nExample: /art futuristic city");
      }

      const prompt = args.join(' ');
      console.log(`Generating AI art for prompt: ${prompt}`);

      // Send loading message
      const loadingMsg = await message.reply("🎨 Generating AI art, please wait...");

      // API call
      const apiUrl = `https://nexalo-api.vercel.app/api/art?prompt=${encodeURIComponent(prompt)}`;
      console.log(`Sending request to ${apiUrl}`);

      const response = await axios.get(apiUrl, { timeout: 15000 });
      const data = response.data;
      console.log(`API response received: ${JSON.stringify(data)}`);

      if (!data.response) {
        return message.reply(`❌ No art generated for "${prompt}". Please try a different prompt.`);
      }

      const imageUrl = data.response;
      
      // Create cache directory
      const tempDir = path.join(__dirname, '..', '..', 'cache');
      await fs.ensureDir(tempDir);

      const fileName = `art_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;
      const filePath = path.join(tempDir, fileName);
      console.log(`Downloading image from ${imageUrl} to ${filePath}`);

      // Download image with retry mechanism
      let imageResponse;
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          imageResponse = await axios.get(imageUrl, { 
            responseType: 'arraybuffer', 
            timeout: 30000 
          });
          break;
        } catch (error) {
          if (attempt === maxRetries) {
            throw new Error(`Failed to download image after ${maxRetries} attempts: ${error.message}`);
          }
          console.log(`Attempt ${attempt} failed: ${error.message}. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); 
        }
      }

      // Save image
      await fs.writeFile(filePath, imageResponse.data);
      console.log(`Image saved: ${filePath}`);

      // Check file size
      const stats = await fs.stat(filePath);
      if (stats.size === 0) {
        throw new Error("Downloaded image is empty");
      }

      // Send art image
      await message.reply({
        body: `🎨 Generated AI art for "${prompt}"!`,
        attachment: fs.createReadStream(filePath)
      });

      console.log(`Sent art image to thread ${threadID}`);

      // Clean up
      await fs.unlink(filePath).catch(err => 
        console.log(`Failed to clean up ${filePath}: ${err.message}`)
      );
      console.log(`Cleaned up ${filePath}`);

    } catch (error) {
      console.error(`Error in art command: ${error.message}`);
      return message.reply(`❌ Failed to generate art: ${error.message}`);
    }
  }
};
