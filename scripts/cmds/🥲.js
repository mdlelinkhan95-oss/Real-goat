 module.exports = {
 config: {
	 name: "🥲",
	 version: "1.0",
	 author: "AceGun",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "🥲") {
 return message.reply({
 body: " 「┏╮/╱ 🌺\n╰🌺•••••••••😽🌸\n╱/ ╰┛\n🌸𝄞⋆⃝উপন্যাসের ༅༎প্রতিটি༅༎\nপৃষ্ঠা♡𝄞⋆⃝༅༎এক- একটি\nভিন্ন༅༎গল্প⋆⃝𝄞♡💞🌷\n🌺𝄞⋆⃝আর༅༎প্রতিটা ༅༎গল্পের⋆⃝𝄞♡শেষ ༅༎🌺\nকথা ༅༎ ভালো ༅༎ থেকো⋆⃝𝄞🥀🍂\n┏╮/╱ 🌺\n╰🌺••••••••😽🌸 \n\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥\n𝗦𝗔𝗚𝗢𝗥」",
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/gq1TvwW.mp4")
 });
 }
 }
}
