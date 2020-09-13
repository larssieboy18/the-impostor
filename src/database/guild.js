const mongoose = require("mongoose");

const dbCache = new Map(), dbSaveQueue = new Map();

const guildObject = {
  guildid: "", // the guild ID
  prefix: "", // the prefix
  category: "", // the category of all of this
  hostingChannel: "", // the hosting channel ID
  newGameVoiceChannel: "", // the "New Game"-voice channel
};

const guildSchema = mongoose.Schema(Object.assign({}, guildObject), { minimize: true }); // make a copy of guildObject
const Guild = mongoose.model("Guild", guildSchema);

const get = (guildid) => new Promise((resolve, reject) => Guild.findOne({ guildid }, (err, guild) => {
  if (err) return reject(err);
  if (!guild) {
    guild = new Guild(Object.assign({}, guildObject));
    guild.guildid = guildid;
  }
  return resolve(guild)
}))

const load = (guildid) => new Promise(async (resolve, reject) => {
  let guild = await get(guildid), guildCache = {}
  for (const key in guildObject) guildCache[key] = guild[key] || guildObject[key]; // if there's no value stored in the guild database then we use the default value
  return resolve(dbCache.set(guildid, guildCache))
});

const save = async (guildid, changes) => {
  if (!dbSaveQueue.has(guildid)) {
    dbSaveQueue.set(guildid, changes);
    let guild = await get(guildid), guildCache = dbCache.get(guildid), guildSaveQueue = dbSaveQueue.get(guildid);
    for (const key of guildSaveQueue) guild[key] = guildCache[key];
    return guild.save().then(res => dbSaveQueue.delete(guildid)).catch(console.log)
  } else dbSaveQueue.get(guildid).push(...changes)
}

module.exports = async guildid => {
  if (!dbCache.has(guildid)) await load(guildid); // if the guild is unloaded for some reason, we load it
  return {

    // debugging
    reload: () => load(guildid),
    unload: () => dbCache.delete(guildid),

    // general access and modifications
    get: () => Object.assign({}, dbCache.get(guildid)),
    set: (key, value) => {
      dbCache.get(guildid)[key] = value;
      save(guildid, [ key ])
    },
    setMultiple: (changes) => {
      let guildCache = dbCache.get(guildid);
      for (const key in changes) guildCache[key] = changes[key];

      save(guildid, Object.keys(changes))
    },
    reset: () => {
      let guildCache = dbCache.get(guildid);
      for (const key in guildObject) guildCache[key] = guildObject[key];

      save(guildid, Object.keys(guildObject))
    }
  }
}