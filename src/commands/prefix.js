module.exports = {
  description: "Set the prefix of the bot. Leave blank to reset.",
  usage: {},
  examples: {},
  aliases: [ "setprefix" ],
  permissionRequired: 2, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args) => true
}

const config = require("../../config.json")

module.exports.run = async (message, args, gdb, { content }) => {
  gdb.set("prefix", content)
  if (!content) return message.channel.send(`✅ The prefix has been reset to the usual: \`${config.prefix}\``)
  else return message.channel.send(`✅ The prefix has been set to \`${content}\``)
}