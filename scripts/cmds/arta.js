const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "arta",
    aliases: [],
    version: "1.0",
    author: "nexo_here",
    countDown: 10,
    role: 0,
    shortDescription: "Generate image using ARTA AI",
    longDescription: "Generate beautiful images with prompt and optional model using ARTA API",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt> | <model (optional)>\nExample: {pn} A cyberpunk city | graffiti"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const input = args.join(" ").split("|");
      const prompt = input[0]?.trim();
      const model = input[1]?.trim() || "Flux"; // default model

      if (!prompt) {
        return api.sendMessage(
          "❌ | Please provide a prompt.\nExample:\n.arta A dragon flying over Tokyo | fantasy_art",
          event.threadID,
          event.messageID
        );
      }

      const wait = await api.sendMessage("⏳ | Generating your image...", event.threadID);

      const tmpDir = path.join(__dirname, "cache");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
      const fileName = `arta_${event.senderID}_${Date.now()}.png`;
      const filePath = path.join(tmpDir, fileName);

      const response = await axios({
        method: "GET",
        url: "https://www.arch2devs.ct.ws/api/arta",
        responseType: "arraybuffer",
        params: {
          prompt,
          model,
          aspectRatio: "1:1",
          n: 1,
          guidanceScale: 7,
          numInferenceSteps: 30,
          negativePrompt: "blurry, deformed hands, ugly"
        }
      });

      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      await api.sendMessage({
        body: `🎨 | Prompt: ${prompt}\n🧠 | Model: ${model}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), wait.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to generate image. Please try again later.", event.threadID, event.messageID);
    }
  }
};
          
