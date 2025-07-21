 module.exports = {
 config: {
	 name: "🥺",
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
 if (event.body && event.body.toLowerCase() === "🥺") {
 return message.reply({
 body: "     「❥᭄ꦿপ্রিয়্যু❥᭄ꦿ🦋🥀-- 😊\n༄❥᭄ꦿযাকে༅!!অন্যের༅!!পাশে༅✿࿐\n༄❃🌸দেখতে༅!!কষ্ট༅!!হয়༅😪🌸❃༉ ❥᭄ꦿতাকে༅!!নিজের༅!!পাশে༅!!যত্ন༅✿࿐ ༄❃🌸করে༅!!রাখতে༅!!হয়༅😌🤞🌸❃༉ ❥᭄ꦿ♥~༅♥❥᭄ꦿ.🙂🥀\n\n🌻🌻\n\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥\n🆁🅾🅱🅸🆄🅻」",
 attachment: await global.utils.getStreamFromURL("https://video.xx.fbcdn.net/v/t42.3356-2/464929396_9020025454723386_6440815047130611509_n.mp4?_nc_cat=108&ccb=1-7&_nc_sid=4f86bc&_nc_eui2=AeE2G24fMU4VzWkyyezW2ZiGCv_gdsrEmbEK_-B2ysSZsY3nrW-BKVuYjNT0lEmb9Vym9mDfqtQc9gUvA53z1Jxy&_nc_ohc=Xthw_BBp22sQ7kNvgHxBHJi&_nc_zt=28&_nc_ht=video.xx&_nc_gid=AnaW7WVnM_R1moTii-_7uye&oh=03_Q7cD1QHhn_Qsnj6nm5fU3kDHW6XAEV2-FzxANWyQF3ORkDa-rA&oe=672428F4&dl=1")
 });
 }
 }
}
