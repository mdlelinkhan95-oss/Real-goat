const axios = require("axios");
const fs = require('fs');
const path = require('path');

// --- Helper Functions ---

// Base API URL লোড করা
async function getBaseApiUrl() {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
    return response.data.api;
  } catch (error) {
    console.error("❌ Failed to fetch base API URL:", error);
    return null;
  }
}

// ফাইল ডাউনলোড করা
async function downloadFile(url, pathName) {
  const writer = fs.createWriteStream(pathName);
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(fs.createReadStream(pathName)));
    writer.on('error', (err) => {
      writer.destroy();
      if (fs.existsSync(pathName)) fs.unlink(pathName, () => reject(err)); // Clean up failed download
      else reject(err);
    });
  });
}

// থাম্বনেইল স্ট্রিম করা ও ফাইল সেভ করা
async function streamUrl(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    fs.writeFileSync(pathName, buffer);
    return fs.createReadStream(pathName);
  } catch (err) {
    console.error("❌ Error streaming URL:", err);
    throw err;
  }
}

// --- Main Command Configuration ---

module.exports = {
  config: {
    name: "video", // কমান্ডের নাম
    version: "1.4.0",
    author: "Dipto (Modified by Perplexity)",
    countDown: 15, // কমান্ড ব্যবহারের সময়ের ব্যবধান
    role: 0, // কে এই কমান্ড ব্যবহার করতে পারবে (0 = সবাই)
    description: "YouTube থেকে ভিডিও, অডিও বা তথ্য ডাউনলোড করুন।",
    category: "media",
    guide: {
        en: "{p}video [অনুসন্ধান শব্দ]\n{p}video -a [অনুসন্ধান শব্দ]\n{p}video -i [অনুসন্ধান শব্দ]\n{p}video [YouTube লিঙ্ক]\n{p}video -a [YouTube লিঙ্ক]\n{p}video -i [YouTube লিঙ্ক]"
    }
  },

  // --- onStart Function ---
  onStart: async function ({ api, args, event, message }) {
    const { threadID, messageID, senderID } = event;
    const baseApiUrl = await getBaseApiUrl();

    if (!baseApiUrl) {
      return message.reply("❌ ভিডিও সার্ভিস কানেক্ট করতে পারেনি। পরে আবার চেষ্টা করুন।");
    }
    
    let action = '-v'; // ডিফল্ট অ্যাকশন: ভিডিও ডাউনলোড
    let query = args.join(" ");

    // ইউজার ইনপুট পার্স করা
    if (query.startsWith('-a ')) {
      action = '-a';
      query = query.substring(3).trim();
    } else if (query.startsWith('-i ')) {
      action = '-i';
      query = query.substring(3).trim();
    } else if (query.startsWith('-v ')) {
      query = query.substring(3).trim(); // -v থাকলে শুধু কোয়েরি অংশ নেয়া হবে
    }
    
    if (!query) return message.reply('❓ দয়া করে একটি ভিডিও লিঙ্ক বা অনুসন্ধানের জন্য শব্দ দিন।');

    // YouTube লিঙ্ক কিনা চেক করা
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const isYouTubeLink = youtubeUrlRegex.test(query);

    const loadingMessage = await message.reply(`⏳ আপনার অনুরোধ প্রস্তুত করা হচ্ছে... দয়া করে অপেক্ষা করুন।`);
    api.setMessageReaction("⏳", messageID, (err) => {}, true);

    if (isYouTubeLink) {
      const videoID = query.match(youtubeUrlRegex)[1];
      await handleDirectDownload(api, message, loadingMessage.messageID, threadID, messageID, videoID, action, baseApiUrl);
    } else {
      await handleSearchAndSelect(api, message, loadingMessage.messageID, threadID, messageID, senderID, query, action, baseApiUrl);
    }
  },
 
  // --- handleReply Function (যখন ইউজার সার্চ ফলাফলে রিপ্লাই করে) ---
  handleReply: async function ({ event, api, handleReply, message }) {
    const { senderID, body } = event;
    if (senderID !== handleReply.author) return; // শুধু কমান্ড ইনিশিয়েট করা ইউজার রিপ্লাই দিতে পারবে

    const choice = parseInt(body);
    if (isNaN(choice) || choice <= 0 || choice > handleReply.result.length) {
      return message.reply("❌ ভুল সংখ্যা দিয়েছেন। অনুগ্রহ করে তালিকা থেকে একটি সঠিক সংখ্যা দিন।");
    }
    
    const selectedVideo = handleReply.result[choice - 1];
    const videoID = selectedVideo.id;
    const { action, baseApiUrl } = handleReply;

    // আগের মেসেজ মুছে ফেলা
    try {
      await api.unsendMessage(handleReply.messageID);
    } catch (e) {
      console.error("❌ Failed to unsend message:", e);
    }
    
    // লোডিং মেসেজ পাঠানো
    const loadingMessage = await message.reply("⏳ আপনার ফাইল প্রস্তুত করা হচ্ছে... এতে কিছুটা সময় লাগতে পারে।");
    
    // থাম্বনেইল ফাইলগুলো ডিলিট করা
    if (handleReply.tempThumbnailPaths && handleReply.tempThumbnailPaths.length > 0) {
      handleReply.tempThumbnailPaths.forEach(p => {
        if (fs.existsSync(p)) {
          fs.unlink(p, err => {
            if (err) console.error("❌ Error deleting temp thumbnail:", err);
          });
        }
      });
    }

    await handleDirectDownload(api, message, loadingMessage.messageID, event.threadID, event.messageID, videoID, action, baseApiUrl);
  }
};

// --- Helper Functions for Download and Search ---

// সরাসরি লিঙ্ক থেকে ডাউনলোড বা তথ্য আনা
async function handleDirectDownload(api, message, loadingMsgID, threadID, messageID, videoID, action, baseApiUrl) {
  try {
    let format = 'mp4';
    let quality = '22'; // Default: 720p for video

    if (action === '-a') {
      format = 'mp3';
      quality = '140'; // Highest quality audio
    }

    if (action === '-i') { // শুধু তথ্যের জন্য
      const { data } = await axios.get(`${baseApiUrl}/ytfullinfo?videoID=${videoID}`);
      const infoBody = `✨ **শিরোনাম:** ${data.title}\n` +
                       `⏳ **সময়কাল:** ${(data.duration / 60).toFixed(2)} মিনিট\n` +
                       `📺 **চ্যানেল:** ${data.channel}\n` +
                       `👀 **দেখা হয়েছে:** ${data.view_count?.toLocaleString() || 'N/A'}\n` +
                       `👍 **লাইক:** ${data.like_count?.toLocaleString() || 'N/A'}\n` +
                       `💬 **মন্তব্য:** ${data.comment_count?.toLocaleString() || 'N/A'}`;
      
      const thumb
                                           
