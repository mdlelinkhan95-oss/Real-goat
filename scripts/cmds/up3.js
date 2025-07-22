const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  config: {
    name: "up",
    version: "1.2",
    author: "AceGun",
    countDown: 5,
    role: 2,
    shortDescription: { en: "" },
    longDescription: { en: "get information." },
    category: "𝗦𝗬𝗦𝗧𝗘𝗠",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event, api, usersData, threadsData }) {
    const gifURLs = [
      "https://i.imgur.com/jsCg0c4.gif",
      "https://i.imgur.com/jsCg0c4.gif"
    ];
    const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
    const gifAttachment = await global.utils.getStreamFromURL(randomGifURL);

    // Bot uptime
    const uptime = process.uptime();
    const s = Math.floor(uptime % 60);
    const m = Math.floor((uptime / 60) % 60);
    const h = Math.floor((uptime / (60 * 60)) % 24);
    const upSt = `${h}Hrs ${m}Min ${s}Sec`;

    // Thread/UID counts
    let threadInfo = await api.getThreadInfo(event.threadID);

    // Gender count
    let b = 0, g = 0;
    for (let z of threadInfo.userInfo) {
      if (z.gender === "MALE") b++;
      else if (z.gender === "FEMALE") g++;
    }
    const u = await usersData.getAll();
    const t = await threadsData.getAll();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const system = `${os.platform()} ${os.release()}`;
    const model = `${os.cpus()[0].model}`;
    const cores = `${os.cpus().length}`;
    const arch = `${os.arch()}`;
    const processMemory = prettyBytes(process.memoryUsage().rss);

    // Disk usage (Linux only)
    let diskUsage = { total: 0, used: 0 };
    try {
      diskUsage = await getDiskUsage();
    } catch (e) {
      diskUsage = { total: 1, used: 0 };
    }

    // Message
    let infoMsg =
      `🐿 | Prefix: 「 ${global.GoatBot.config.prefix} 」\n`
      + `🏃 | Bot Running: ${upSt}\n`
      + `💁‍♂ | Boys: ${b}\n`
      + `💁‍♀ | Girls: ${g}\n`
      + `🏘 | Groups: ${t.length}\n`
      + `👪 | Users: ${u.length}\n`
      + `📡 | OS: ${system}\n`
      + `📱 | Model: ${model}\n`
      + `🛡 | Cores: ${cores}\n`
      + `🗄 | Architecture: ${arch}\n`
      + `📀 | Disk Information:\n`
      + `        ${generateProgressBar((diskUsage.used / diskUsage.total) * 100)}\n`
      + `        Usage: ${prettyBytes(diskUsage.used)}\n`
      + `        Total: ${prettyBytes(diskUsage.total)}\n`
      + `💾 | Memory Information:\n`
      + `        ${generateProgressBar((process.memoryUsage().rss / totalMemory) * 100)}\n`
      + `        Usage: ${processMemory}\n`
      + `        Total: ${prettyBytes(totalMemory)}\n`
      + `🗃 | Ram Information:\n`
      + `        ${generateProgressBar(((totalMemory - freeMemory) / totalMemory) * 100)}\n`
      + `        Usage: ${prettyBytes(usedMemory)}\n`
      + `        Total: ${prettyBytes(totalMemory)}`;

    await message.reply({
      body: infoMsg,
      attachment: gifAttachment
    });
  }
};

async function getDiskUsage() {
  // This only works on linux/unix!
  const { stdout } = await exec('df -k /');
  const lines = stdout.trim().split('\n');
  const [_filesystem, total, used] = lines[1].split(/\s+/);
  return { total: parseInt(total) * 1024, used: parseInt(used) * 1024 };
}

function prettyBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

function generateProgressBar(percentage) {
  const totalSections = 10;
  const filledSections = Math.ceil((percentage / 100) * totalSections);
  return `[${'█'.repeat(filledSections)}${'▒'.repeat(totalSections - filledSections)}]`;
}
