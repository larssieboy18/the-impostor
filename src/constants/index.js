const config = require("../../config.json")

// load other files
module.exports = Object.assign({}, require("./embeds.js"), require("./time.js"))

// permission calculator
module.exports.getPermissionLevel = member => {
  if (config.admins[0] == member.id) return 5; // bot owner
  if (config.admins.includes(member.id)) return 4; // bot admin
  if (member.guild.ownerID == member.id) return 3; // server owner
  if (member.hasPermission("MANAGE_GUILD")) return 2; // server admin
  if (member.hasPermission("MANAGE_MESSAGES")) return 1; // server mod
  return 0; // server member
}