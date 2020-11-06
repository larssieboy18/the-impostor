module.exports = {
  description: "Set up channels for the bot. You only need to do this once.",
  usage: {},
  examples: {},
  aliases: [ "autosetup", "quicksetup", "configure" ],
  permissionRequired: 2, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args) => !args.length
};

const { recreatePanel } = require("../handlers/hosting.js");

module.exports.run = async (message, args, gdb) => {
  const { hostingChannel, newGameVoiceChannel, category } = gdb.get();
  if (hostingChannel || newGameVoiceChannel || category) {
    const overwrite = await new Promise(resolve => {
      message.channel.send("⚠️ This server has been configured before. If you continue, your old setup would no longer work. Are you sure you want to continue?\nType `yes` or `no` in chat.");
      message.channel.awaitMessages(m => m.author.id == message.author.id && ["yes", "no"].includes(m.content.toLowerCase()), { max: 1, time: 30000, errors: [ "time" ]})
        .then(collection => collection.first().content == "yes" ? resolve(true) : resolve(false))
        .catch(() => resolve(false));
    });
    if (!overwrite) return message.channel.send("✴️ New configuration canceled.");
  }

  // check if bot has permissions first!! TODO
  if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("❌ The bot is missing the `Manage Channels`-permission. Please fix the issue and retry.");

  const m = await message.channel.send("♨️ Configuring the server, please wait... This should not take more than 15 seconds.");

  const basePermissions = [
    {
      id: message.client.user.id,
      allow: [
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MANAGE_MESSAGES",
        "ADD_REACTIONS",
        "MANAGE_CHANNELS",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS"
      ]
    }
  ];

  // create the category
  const cChannel = await message.guild.channels.create("Among us", {
    type: "category",
    permissionOverwrites: basePermissions
  });

  // create hosting panel
  const hChannel = await recreatePanel(gdb, message.guild, cChannel);
  if (!hChannel) return message.channel.send("❌ Something went wrong when creating the hosting channel.");

  // create new game VC
  const nVoiceChannel = await message.guild.channels.create("➕ Create new game", {
    type: "voice",
    parent: cChannel,
    permissionOverwrites: [
      ...basePermissions,
      {
        id: message.guild.roles.everyone,
        deny: [
          "SPEAK"
        ]
      }
    ]
  });

  gdb.setMultiple({
    category: cChannel.id,
    hostingChannel: hChannel.id,
    newGameVoiceChannel: nVoiceChannel.id
  });

  m.edit(`✅ Done! Get started by reading ${hChannel}, and have fun!`);
};