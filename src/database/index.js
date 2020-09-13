const config = require("../../config.json"), mongoose = require("mongoose");
mongoose.connect(config.database_uri, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
  guild: require("./guild.js"), // guild(guildid)
}