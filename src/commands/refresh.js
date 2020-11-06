module.exports = {
  description: "Refresh the hosting panel.",
  usage: {},
  examples: {},
  aliases: [ "regenerate", "regen" ],
  permissionRequired: 1, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args) => !args.length
};

const { recreatePanel } = require("../handlers/hosting.js");

module.exports.run = async (message, args, gdb, { prefix }) => {
  const { hostingChannel } = gdb.get(), hChannel = message.guild.channels.resolve(hostingChannel);

  const success = await recreatePanel(gdb, message.guild);
  if (success) {
    if (hChannel) hChannel.delete();
    return message.channel.send("✅ Done! The hosting panel is now recreated.");
  } else return message.channel.send(`❌ Something went wrong. Are you sure the bot has permission? Please also try and remake the configuration with \`${prefix}setup\` before contacting support.`);
};