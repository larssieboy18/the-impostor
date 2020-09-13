module.exports = {
  description: "Get the latency of the bot.",
  usage: {},
  examples: {},
  aliases: [ "pong", "latency", "uptime" ],
  permissionRequired: 0, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args) => !args.length
}

module.exports.run = async (message, args, gdb, { prefix }) => {
  message.channel.send(`📋 To get started, do \`${prefix}setup\`. If you need help, go to the support server: https://promise.solutions/support`)
}