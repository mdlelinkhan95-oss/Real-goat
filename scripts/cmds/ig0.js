const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ig",
    version: "1.1.0",
    permission: 0,
    credits: "Mohammad Rahad (Fixed by AI)",
    description: "Send random Instagram images",
    prefix: true,
    category: "image",
    usages: "ig",
    cooldowns: 5,
  },

  onStart: async function({ api, event, message }) {
    try {
      const hi = ["🥵🥵🥵"];
      const know = hi[Math.floor(Math.random() * hi.length)];
      
      const link = [
        "https://i.postimg.cc/m2WYvv51/129726529-216675409883467-7099287151035323348-n.jpg",
"https://i.postimg.cc/k5H8fzS4/131479519-329495765215645-4589616289534954944-n.jpg",
"https://i.postimg.cc/zvKnL7Vf/139412024-468783360810452-801530949372370445-n.jpg",
"https://i.postimg.cc/VsC9HfDc/139572806-166504948200692-8142208774794964171-n.jpg",
"https://i.postimg.cc/wBML5g7Z/139718212-447240470052046-3470444448848618187-n.jpg",
"https://i.postimg.cc/sgw5ZvD5/140085207-438053364057578-1556485101997078968-n.jpg",
"https://i.postimg.cc/CLCGSc3P/140088186-1889968201155219-7508719329963428011-n.jpg",
"https://i.postimg.cc/2Sz464mz/140381014-743128666322087-3052012302502325706-n.jpg",
"https://i.postimg.cc/brcnjn3f/140478950-3166000740167328-8628237311977849976-n.jpg",
"https://i.postimg.cc/jSd7KtQ2/140575229-152102506543705-1681082115184473810-n.jpg",
"https://i.postimg.cc/SR6MQKv2/140786282-247583126733562-2436436463193304888-n.jpg",
"https://i.postimg.cc/rmt4bjG9/141074918-447202789989180-7289576361994524560-n.jpg",
"https://i.postimg.cc/Jz6BzvPq/141112571-1166508153781794-9212413980030617097-n.jpg",
"https://i.postimg.cc/02CwLbSh/141136642-766484324074864-6550837402007361974-n.jpg",
"https://i.postimg.cc/wTzNfh1h/141438065-163268211970366-5206619481646717800-n.jpg",
"https://i.postimg.cc/XNdFk2Yj/142744942-927404021401955-1835405737710610314-n.jpg",
"https://i.postimg.cc/hjxJMjgy/142858699-1287840701589617-3132105632664477640-n.jpg",
"https://i.postimg.cc/pdm5hCSt/142884881-769841607276513-5084203243386782967-n.jpg",
"https://i.postimg.cc/Gp68kY0T/142924018-854501892069576-9219669948274561464-n.jpg",
"https://i.postimg.cc/MHSnLSpW/142928614-1055675104911406-8438379809452129886-n.jpg",
"https://i.postimg.cc/hv1XW5XV/143300989-3901873176530456-8660014916941124976-n.jpg",
"https://i.postimg.cc/c4dKM0zh/143369538-410403760221741-393549076969948510-n.jpg",
"https://i.postimg.cc/h4Lzdf2h/143499424-170523604506043-5378710610117480432-n.jpg",
"https://i.postimg.cc/ZKjWwXtS/143509851-4070361313008185-4341101886575779151-n.jpg",
"https://i.postimg.cc/P5xP9KT8/143593950-330042274941949-6767795698205873234-n.jpg",
"https://i.postimg.cc/VkVd8MkZ/143798653-1050700132078296-5004605923341345799-n.jpg",
"https://i.postimg.cc/YSLjq94r/144217656-3636539226382118-7074681988570887903-n.jpg",
"https://i.postimg.cc/wvKMtpJh/144326460-532198564385049-7646272594624321493-n.jpg",
"https://i.postimg.cc/NM1Mmz7Z/144856862-338891070589747-6978889274446031993-n.jpg",
"https://i.postimg.cc/FzNKZVTz/145642444-1715428501978646-4401859796641729637-n.jpg",
"https://i.postimg.cc/y8k8vdym/145765637-812115589373336-8806531658497408437-n.jpg",
"https://i.postimg.cc/tRNJg8gx/146021330-834567590434295-7586305472601134595-n.jpg",
"https://i.postimg.cc/d36VSZfB/148482956-109659071049581-6761982447487331284-n.jpg",
"https://i.postimg.cc/RVCFJG3b/148656540-113060877445908-6285164756898594924-n.jpg",
"https://i.postimg.cc/J4ThNJZ7/149026806-249849826597298-6037049795759730706-n.jpg",
"https://i.postimg.cc/7ZdYckKp/149813015-3604850379605616-6245449335021237200-n.jpg",
"https://i.postimg.cc/9f9FHnSz/150527779-923366495137974-5234323708860145453-n.jpg",
"https://i.postimg.cc/9Mtmrqch/150763127-447810529999923-661801092811698916-n.jpg",
"https://i.postimg.cc/KzycG5Sf/151172913-1167669677018425-7380804724443608361-n.jpg",
"https://i.postimg.cc/sxjVSD2Z/151242704-1105399043218205-8871176718640958153-n.jpg",
"https://i.postimg.cc/hv2K0WJZ/151685053-765123874132750-3189945205888443749-n.jpg",
"https://i.postimg.cc/c4JxLHjp/151788187-114324653910793-3639792033688109509-n.jpg",
"https://i.postimg.cc/CM7M0DvC/152847801-431050868158885-6362526856949725255-n.jpg",
"https://i.postimg.cc/9FNWR2Hr/153098719-2184735608327510-7273946047484940530-n.jpg",
"https://i.postimg.cc/6pktch3K/153264359-401319794630358-5469924899354389374-n.jpg",
"https://i.postimg.cc/Ssr4yFGQ/154757765-459237958607220-9018353427687635911-n.jpg",
"https://i.postimg.cc/0jysjWtY/154793981-438991524193133-5886004716292657195-n.jpg",
"https://i.postimg.cc/gkrpP7Ld/156174055-424965192142160-1197633634757825298-n.jpg",
"https://i.postimg.cc/hGVg57zd/156499581-117945523617492-6875481364055370707-n.jpg",
"https://i.postimg.cc/59sJTJ0n/156681827-1368931170128958-2876288358323265786-n.jpg",
"https://i.postimg.cc/G2rrwhGS/157064938-431999511348135-3035395486619913360-n.jpg",
"https://i.postimg.cc/5NGV9m8z/158173293-278942173747424-6421490678449597015-n.jpg",
"https://i.postimg.cc/brVjtxMK/158184997-3764071256974108-5120087570811511337-n.jpg",
"https://i.postimg.cc/V64xx9Yd/158436048-210788120832548-1307537500059417358-n.jpg",
"https://i.postimg.cc/xdGDRDhG/158477768-467751201045919-6813115304248533845-n.jpg",
"https://i.postimg.cc/MTWk33JC/159658112-3699027880145101-4023320335714066501-n.jpg",
"https://i.postimg.cc/g0bb8kSk/159993022-440531337059087-8731038995252090334-n.jpg",
"https://i.postimg.cc/x84WC0NQ/160219588-550728366091782-8349748340196678025-n.jpg",
"https://i.postimg.cc/yxdMsJdn/160312667-261014999005539-5272668415539116202-n.jpg",
"https://i.postimg.cc/bNZ7524w/160376686-271270474585746-3702590855557029686-n.jpg",
"https://i.postimg.cc/ZYskjL7Q/160638821-270545787977363-7632150897283595235-n.jpg",
"https://i.postimg.cc/vHCJwZdL/160729121-112777014178165-5976123126982888933-n.jpg",
"https://i.postimg.cc/rwWvV2V6/161555074-113293230792118-2858187962135186252-n.jpg",
"https://i.postimg.cc/1tWdC9HF/161583418-775934183042370-4712492056359846676-n.jpg",
"https://i.postimg.cc/43QqcvHB/161809597-3209135296082279-3338277826978255057-n.jpg",
"https://i.postimg.cc/85k3mFhD/162076778-140362071327757-1733969105619790989-n.jpg",
"https://i.postimg.cc/3wTzWfNk/162108488-931013524301057-9090480452582843706-n.jpg",
"https://i.postimg.cc/4ymSjrLS/162117494-277521247201458-1947119458589827621-n.jpg",
"https://i.postimg.cc/rs3PTQ7F/162195775-487563038942793-2992691117170029714-n.jpg",
"https://i.postimg.cc/zDcMTG3Z/162430083-1132149580580593-4108732181238916725-n.jpg",
"https://i.postimg.cc/zXHQ7YRL/163642910-187566992919746-2707897198397749870-n.jpg",
"https://i.postimg.cc/9QGn3PbC/163655394-502225520939195-6053227630361882791-n.jpg",
"https://i.postimg.cc/T384HNrt/164484089-256688922815499-4830079456586057999-n.jpg",
"https://i.postimg.cc/QMhnjBY5/164572564-252933866494071-7536326501415667475-n.jpg",
"https://i.postimg.cc/fbCqyw1P/164606860-293273442203826-3881955684334529013-n.jpg",
"https://i.postimg.cc/B6wh5mSc/164942033-777879289499727-1747622708237180804-n.jpg",
      ];
      
      const randomLink = link[Math.floor(Math.random() * link.length)];
      
      // cache ফোল্ডার আছে কিনা তা নিশ্চিত করা
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      
      const imagePath = path.join(cacheDir, `ig_${Date.now()}.jpg`);
      
      // axios দিয়ে ইমেজ ডাউনলোড
      const imageResponse = await axios.get(randomLink, { responseType: "arraybuffer" });
      await fs.writeFile(imagePath, Buffer.from(imageResponse.data));
      
      // মেসেজ পাঠানো
      await message.reply({
        body: know,
        attachment: fs.createReadStream(imagePath)
      });
      
      // ডাউনলোড করা ফাইল ডিলিট করা
      await fs.unlink(imagePath);

    } catch (error) {
      console.error("ig command error:", error.message);
      message.reply("❌ দুঃখিত, এই মুহূর্তে ছবিটি আনা সম্ভব হচ্ছে না।");
    }
  }
};
	  
