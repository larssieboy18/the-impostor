module.exports = {
  description: "Refresh the hosting panel.",
  usage: {},
  examples: {},
  aliases: [ "regenerate", "regen" ],
  permissionRequired: 1, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args) => !args.length
}

const { refreshPanel } = require("../handlers/hosting.js");

module.exports.run = async (message, args, gdb, { prefix }) => {
  const { hostingChannel } = gdb.get(), hChannel = message.guild.channels.resolve(hostingChannel);
  if (!hChannel) return message.channel.send(`❌ This server has not been configured. Do \`${prefix}setup\` to set it up!`)
  if (!hChannel.viewable) return message.channel.send(`❌ The hosting panel has either been deleted from the server or hidden from the bot. Try reconfiguring it with \`${prefix}setup\`.`)

  const success = await refreshPanel(hChannel, true);
  if (success) return message.channel.send("✅ Done! The hosting panel is now refreshed.");
  else return message.channel.send(`❌ Something went wrong. Are you sure the bot has permission? Please also try and remake the configuration with \`${prefix}setup\` before contacting support.`)
}