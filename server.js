const Discord = require("discord.js"), config = require("./config.json");

const client = new Discord.Client({
  fetchAllMembers: true,
  disableMentions: "everyone",
  presence: {
    status: "online",
    activity: {
      name: "the cameras",
      type: "WATCHING"
    }
  }
})

let guild, hostpanel;

client.on("ready", async () => {
  console.log("Ready as", client.user.tag);

  // find the guild
  guild = await client.guilds.fetch(config.guildid);

  // give new members the guest role
  if (config.guestroleid) (await guild.members.fetch()).filter(member => !member.user.bot && !member.roles.cache.get(config.guestroleid)).forEach(member => member.roles.add(config.guestroleid))

  // find the host panel message, or create one
  let hostchannel = guild.channels.resolve(config.hostpanelchannelid);
  await hostchannel.bulkDelete(50)
  await hostchannel.send({
    embed: {
      title: "How to Host",
      description: [
        config.gameruleschannelid ? `*__Before starting on hosting your own game, make sure you've read <#${config.gameruleschannelid}>.__*` : null,
        `1. Join the \`${guild.channels.get(config.newgamevcid).name}\`-voice channel to create your own voice channel.`,
        "2. Get educated on the host actions below before starting your first game.",
        "3. Invite some friends to join you and give them the game code for the game."
      ].filter(s => s).join("\n"),
      color: 0x3498DB
    }
  })
  await hostchannel.send({
    embed: {
      title: "When someone is killed",
      description: [
        "To mark someone as dead, server mute them once there's a discussion.",
        "**PS!** Do NOT server mute them in-game, it would alert the other crewmates that they are dead!"
      ].join("\n"),
      color: 0xE74C3C
    }
  })
  hostpanel = await hostchannel.send({
    embed: {
      title: "Host Actions",
      description: [
        "🔇 **IN-GAME:** Crewmates are deafened, and ghosts can talk to each other.",
        "🔊 **DISCUSSION:** Crewmates are undeafened, and ghosts are muted.",
        "♻️ **GAME-OVER:** Unmute and undeafen everyone."
      ].join("\n"),
      color: 0xF1C40F
    }
  })
  await hostpanel.react("🔊");
  await hostpanel.react("♻️");
  await hostpanel.react("🔇");
})

client.on("voiceStateUpdate", async (oldVoice, newVoice) => {
  if (newVoice.channelID == config.newgamevcid) {
    let channel = await guild.channels.create(`${newVoice.member.displayName}'s Game`, {
      type: "voice",
      userLimit: 10,
      parent: newVoice.channel.parent,
      permissionOverwrites: []
    });
    await newVoice.member.edit({ channel })
    await channel.updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: null })
    await channel.updateOverwrite(newVoice.member, { MUTE_MEMBERS: true, DEAFEN_MEMBERS: true })
  }
  if (!oldVoice.channel.members.size && oldVoice.channel.parent.id == config.gamecategoryid && oldVoice.channelID !== config.newgamevcid) oldVoice.channel.delete();
})

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.message.id == hostpanel.id) {
    let vc = guild.members.resolve(user).voice.channel;
    if (!vc || !vc.permissionsFor(user).has("MUTE_MEMBERS")) return reaction.users.remove(user); // they're not in a VC, or they don't have host perms in the VC, so we cancel

    if (reaction.emoji.name == "🔇") {
      let alive = vc.members.filter(member => !member.voice.serverMute), dead = vc.members.filter(member => member.voice.serverMute);
      await Promise.all(alive.map(member => member.edit({ mute: false, deaf: true })))
      await Promise.all(dead.map(member => member.edit({ mute: false, deaf: false })))
    } else if (reaction.emoji.name == "🔊") {
      let alive = vc.members.filter(member => member.voice.serverDeaf), dead = vc.members.filter(member => !member.voice.serverDeaf);
      await Promise.all(dead.map(member => member.edit({ mute: true, deaf: false })))
      await Promise.all(alive.map(member => member.edit({ mute: false, deaf: false })))
    } else if (reaction.emoji.name == "♻️") {
      await Promise.all(vc.members.filter(member => member.voice.serverMute || member.voice.serverDeaf).map(member => member.edit({ mute: false, deaf: false })))
    }
    reaction.users.remove(user)
  }
})

if (config.guestroleid) client.on("guildMemberAdd", member => member.roles.add(config.guestroleid))

client.login(config.token)