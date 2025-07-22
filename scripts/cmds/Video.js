const axios = require("axios");
const fs = require('fs');
const path = require('path');

// Helper to fetch the base API URL safely (আপনার দিপ্ত API এর জন্য)
async function getBaseApiUrl() {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
    return response.data.api;
  } catch (error) {
    console.error("Failed to fetch base API URL:", error);
    return null; // Return null if fetching fails
  }
}

async function downloadFile(url, pathName) {
  const writer = fs.createWriteStream(pathName);
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(fs.createReadStream(pathName)));
    writer.on('error', (err) => {
      writer.destroy();
      fs.unlink(pathName, () => reject(err)); // Clean up failed download
    });
  });
}

async function streamUrl(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" }); // Use arraybuffer for more robust download
    const buffer = Buffer.from(response.data);
    fs.writeFileSync(pathName, buffer);
    return fs.createReadStream(pathName);
  } catch (err) {
    console.error("Error streaming URL:", err);
    throw err;
  }
}

module.exports = {
  config: {
    name: "video",
    version: "1.3.0",
    author: "dipto (Fixed by Ullash, Modified by Perplexity)",
    countDown: 15, // Increased countdown due to potential download time
    role: 0,
    description: "Download video, audio, and info from YouTube.",
    category: "media",
    guide: {
        en: "{p}yt [search query]\n{p}yt -a [search query]\n{p}yt -i [search query]\n{p}yt [YouTube Link]\n{p}yt -a [YouTube Link]\n{p}yt -i [YouTube Link]"
    }
  },

  onStart: async function ({ api, args, event, message }) {
    const { threadID, messageID, senderID } = event;
    const baseApiUrl = await getBaseApiUrl();

    if (!baseApiUrl) {
      return message.reply("❌ Could not connect to the video service. Please try again later.");
    }
    
    let action = '-v'; // Default action is video
    let query = args.join(" ");

    if (query.startsWith('-a ')) {
      action = '-a';
      query = query.substring(3).trim();
    } else if (query.startsWith('-i ')) {
      action = '-i';
      query = query.substring(3).trim();
    } else if (query.startsWith('-v ')) { // Allow explicit -v
      query = query.substring(3).trim();
    }
    
    if (!query) return message.reply('❓ Please provide a search term or a YouTube link.');

    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const isYouTubeLink = youtubeUrlRegex.test(query);

    const loadingMessage = await message.reply(`⏳ Preparing your request... Please wait.`);
    api.setMessageReaction("⏳", messageID, (err) => {}, true);

    if (isYouTubeLink) {
      const videoID = query.match(youtubeUrlRegex)[1];
      await handleDirectDownload(api, message, loadingMessage.messageID, threadID, messageID, videoID, action, baseApiUrl);
    } else {
      await handleSearchAndSelect(api, message, loadingMessage.messageID, threadID, messageID, senderID, query, action, baseApiUrl);
    }
  },
 
  handleReply: async ({ event, api, handleReply, message }) => {
    const { senderID, body } = event;
    if (senderID !== handleReply.author) return;

    const choice = parseInt(body);
    if (isNaN(choice) || choice <= 0 || choice > handleReply.result.length) {
      return message.reply("❌ Invalid number. Please reply with a valid number from the list.");
    }
    
    const selectedVideo = handleReply.result[choice - 1];
    const videoID = selectedVideo.id;
    const { action, baseApiUrl } = handleReply;

    await api.unsendMessage(handleReply.messageID).catch(e => {}); // Remove selection message
    const loadingMessage = await message.reply("⏳ Preparing your file... This may take a moment.");
    
    await handleDirectDownload(api, message, loadingMessage.messageID, event.threadID, event.messageID, videoID, action, baseApiUrl);
  }
};

async function handleDirectDownload(api, message, loadingMsgID, threadID, messageID, videoID, action, baseApiUrl) {
  try {
    const format = (action === '-v') ? 'mp4' : 'mp3';
    const quality = (action === '-v') ? '22' : '140'; // 22 for 720p video, 140 for highest quality audio

    const { data: downloadData } = await axios.get(`${baseApiUrl}/ytDl3?link=${videoID}&format=${format}&quality=${quality}`);
    
    if (!downloadData.downloadLink) {
      throw new Error("No download link found.");
    }

    const tempPath = path.join(__dirname, 'cache', `yt_dl_${Date.now()}.${format}`);
    const fileStream = await downloadFile(downloadData.downloadLink, tempPath);

    await message.reply({
      body: `✅ **${downloadData.title}**\n*Quality: ${downloadData.quality || 'N/A'}*\n*Size: ${downloadData.size || 'N/A'}*`,
      attachment: fileStream
    });
    
    fs.unlinkSync(tempPath); // Clean up the downloaded file

  } catch (e) {
    console.error("Direct Download Error:", e);
    message.reply('❌ Failed to download the file. Please try again later or try a different link/query.');
  } finally {
    api.unsendMessage(loadingMsgID).catch(e => {}); // Remove loading message
    api.setMessageReaction("✅", messageID, (err) => {}, true); // Add reaction
  }
}

async function handleSearchAndSelect(api, message, loadingMsgID, threadID, messageID, senderID, query, action, baseApiUrl) {
  try {
    const searchResult = (await axios.get(`${baseApiUrl}/ytFullSearch?songName=${encodeURIComponent(query)}`)).data.slice(0, 5);
    if (!searchResult.length) {
      throw new Error(`No results found for: ${query}`);
    }
    
    let msg = "✨ **YouTube Search Results** ✨\n\n";
    const thumbnails = [];
    let tempThumbnailPaths = [];

    for (let i = 0; i < searchResult.length; i++) {
        const info = searchResult[i];
        const thumbPath = path.join(__dirname, 'cache', `thumb_${Date.now()}_${i}.jpg`);
        thumbnails.push(streamUrl(info.thumbnail, thumbPath).then(stream => {
            tempThumbnailPaths.push(thumbPath); // Store path for cleanup
            return stream;
        }));
        msg += `**${i + 1}. ${info.title}**\n *› Time: ${info.time}*\n *› Channel: ${info.channel.name}*\n\n`;
    }
    
    await api.unsendMessage(loadingMsgID).catch(e => {});

    api.sendMessage({
      body: msg + "👉 Reply to this message with a number to select.",
      attachment: await Promise.all(thumbnails)
    }, threadID, (err, info) => {
      if (err) {
          console.error(err);
          message.reply("❌ An error occurred while sending search results.");
      } else {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            result: searchResult,
            action,
            baseApiUrl,
            tempThumbnailPaths // Pass paths for cleanup
          });
      }
      // Clean up thumbnails after message is sent (or failed to send)
      tempThumbnailPaths.forEach(p => fs.unlink(p, err => { if (err) console.error("Error unlinking thumb:", err); }));
    }, messageID);

  } catch (err) {
    console.error(err);
    message.reply("❌ An error occurred while searching: " + err.message);
  } finally {
    api.setMessageReaction("✅", messageID, (err) => {}, true);
  }
}
