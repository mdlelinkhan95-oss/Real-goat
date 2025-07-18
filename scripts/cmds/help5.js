const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help5",
    version: "1.18",
    author: "NTKhang", // original: Kshitiz
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly"
    },
    longDescription: {
      en: "View command usage and list all commands directly"
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName "
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // Show All Commands List
    if (args.length === 0) {
      let msg = `╔══════════════╗\n     RAFI CMD💐\n╚══════════════╝`;
      let categories = {};

      // Build category-wise command list
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      // Show All Categories & Commands (skip info itself)
      for (const category of Object.keys(categories)) {
        if (category.toLowerCase() === "info") continue;
        msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』`;
        const names = categories[category].sort();
        for (const name of names) {
          msg += `\n│🎀${name}🎀`;
        }
        msg += `\n╰────────⭓`;
      }
      msg += `\n𝗖𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆, 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗵𝗮𝘀 ${commands.size} 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝘁𝗵𝗮𝘁 𝗰𝗮𝗻 𝗯𝗲 𝘂𝘀𝗲𝗱\n`;
      msg += `𝗧𝘆𝗽𝗲 ${prefix}𝗵𝗲𝗹𝗽 𝗰𝗺𝗱𝗡𝗮𝗺𝗲 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗱𝗲𝘁𝗮𝗶𝗹𝘀 𝗼𝗳 𝘁𝗵𝗮𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱\n\n`;
      msg += `YAZKY AI CHATBOT 💐`;

      // Attachment image (use your given cloudinary link if you want)
      const helpListImage = "https://i.imgur.com/8d6WbRJ.gif";
      // Example: const helpListImage = "https://pplx-res.cloudinary.com/image/upload/v1752291950/user_uploads/16172130/c4d73456-f12b-485e-a2df-1790773150c3/1000262632.jpg";
      try {
        return await message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(helpListImage)
        });
      } catch {
        // Image fail fallback
        return message.reply(msg);
      }
    }

    // Show Details for Specific Command
    const commandName = args[0].toLowerCase();
    const findCommand =
      commands.get(commandName) ||
      commands.get(aliases.get(commandName));
    if (!findCommand) {
      return message.reply(`Command "${commandName}" not found.`);
    }

    const configCommand = findCommand.config;
    const roleText = roleTextToString(configCommand.role);
    const author = configCommand.author || "Unknown";
    const longDescription = configCommand.longDescription
      ? configCommand.longDescription.en || "No description"
      : "No description";
    const aliasesList = configCommand.aliases
      ? configCommand.aliases.join(", ")
      : "None";

    const guideBody =
      configCommand.guide?.en ||
      configCommand.guide ||
      "No guide available.";
    const usage = guideBody
      .replace(/{p}/g, prefix)
      .replace(/{pn}/g, `${prefix}${configCommand.name}`)
      .replace(/{n}/g, configCommand.name);

    const response = `╭── NAME ────⭓
│ ${configCommand.name}
├── INFO
│ Description: ${longDescription}
│ Other names: ${aliasesList}
│ Version: ${configCommand.version || "1.0"}
│ Role: ${roleText}
│ Time per command: ${configCommand.countDown || 1}s
│ Author: ${author}
├── Usage
│ ${usage}
├── Notes
│ <...> = change content
│ [a|b|c] = choose a or b or c
╰━━━━━━━❖`;
    await message.reply(response);
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Bot admin only)";
    default:
      return "Unknown role";
  }
		}
	  
