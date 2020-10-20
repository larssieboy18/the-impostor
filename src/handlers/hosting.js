const actionPanels = new Map(), gameStates = new Map(), voiceResets = new Set(); // guild ID: action panel message ID

const { panelEmbeds } = require("../constants/index.js")

module.exports.configure = (client, db) => { // on startup
  client.on("voiceStateUpdate", async (oldVoice, newVoice) => {
    const gdb = await db.guild(newVoice.guild.id), { newGameVoiceChannel, category } = gdb.get();

    // unmute/undeafen queued users
    if (newVoice.channel && voiceResets.delete(`${oldVoice.guild.id}-${oldVoice.member.id}`)) newVoice.member.edit({ mute: false, deaf: false })

    // create new rooms
    if (newVoice.channelID == newGameVoiceChannel) {
      let channel = await newVoice.guild.channels.create(`${newVoice.member.displayName}'s Game`, {
        type: "voice",
        userLimit: 10,
        parent: category,
        permissionOverwrites: []
      });
      gameStates.set(channel.id, "game-over")
      await newVoice.member.edit({ channel })
      await channel.updateOverwrite(newVoice.member, { MUTE_MEMBERS: true, DEAFEN_MEMBERS: true })
    }

    // delete empty rooms
    if (
      oldVoice.channel &&
      !oldVoice.channel.members.size &&
      oldVoice.channelID !== newGameVoiceChannel &&
      oldVoice.channel.parent &&
      oldVoice.channel.parent.id == category
    ) oldVoice.channel.delete();

    // when joining a room, mute/deafen them if needed
    if (
      newVoice.channel &&
      newVoice.channel.parent &&
      newVoice.channel.parent.id == category &&
      !(
        oldVoice.channel &&
        newVoice.channelID == oldVoice.channelID
      )
    ) {
      let gameState = gameStates.get(newVoice.channel.id);
      if (!gameState) gameState = await guessGameState(newVoice.channel);

      if ((gameState == "game-over" || gameState == "in-game") && (newVoice.serverMute || newVoice.serverDeaf)) newVoice.member.edit({ mute: false, deaf: false })
      else if (gameState == "discussion" && (!newVoice.serverMute || newVoice.serverDeaf)) newVoice.member.edit({ mute: true, deaf: false })
    }

    // when leaving a room, unmute/undeafen them if needed
    if (
      oldVoice.channel &&
      oldVoice.channel.parent &&
      oldVoice.channel.parent.id == category &&
      !(
        newVoice.channel &&
        oldVoice.channelID == newVoice.channelID
      ) &&
      (
        newVoice.serverMute ||
        newVoice.serverDeaf
      )
    ) {
      if (newVoice.channelID) newVoice.member.edit({ mute: false, deaf: false });
      else voiceResets.add(`${oldVoice.guild.id}-${oldVoice.member.id}`); // we can only unmute and undeafen them if they're in a voice channel. we rather need to queue for it to happen.
    }
  })

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    const gdb = await db.guild(reaction.message.guild.id), { category } = gdb.get(), actionsMessage = actionPanels.get(reaction.message.guild.id);

    if (reaction.message.id == actionsMessage) {
      let member = reaction.message.guild.members.resolve(user);
      if (!member) return reaction.users.remove(user); // the user is not cached. if a user is in a VC, they automatically get cached, so we know they're not in a game VC.

      let vc = member.voice.channel;
      if (!vc || !vc.parent || vc.parent.id !== category || !vc.permissionsFor(user).has("MUTE_MEMBERS")) return reaction.users.remove(user); // they're not in a game VC, or they don't have host perms in the game VC, so we cancel

      if (reaction.emoji.name == "🔘") {
        let gameState = gameStates.get(vc.id);
        if (!gameState) gameState = await guessGameState(vc);

        if (gameState == "in-game") { // we want to mute the dead ones and undeafen the alive ones
          gameStates.set(vc.id, "discussion")
          let alive = vc.members.filter(member => member.voice.serverDeaf), dead = vc.members.filter(member => !member.voice.serverDeaf);
          await Promise.all(dead.map(member => member.edit({ mute: true, deaf: false })))
          await Promise.all(alive.map(member => member.edit({ mute: false, deaf: false })))
        } else { // discussion or game-over; we want to deafen the alive ones and unmute the dead ones
          gameStates.set(vc.id, "in-game")
          let alive = vc.members.filter(member => !member.voice.serverMute), dead = vc.members.filter(member => member.voice.serverMute);
          await Promise.all(alive.map(member => member.edit({ mute: false, deaf: true })))
          await Promise.all(dead.map(member => member.edit({ mute: false, deaf: false })))
        }//🔰
      } else if (reaction.emoji.name == "♻️") {
        gameStates.set(vc.id, "game-over")
        await Promise.all(vc.members.filter(member => member.voice.serverMute || member.voice.serverDeaf).map(member => member.edit({ mute: false, deaf: false })))
      }
      reaction.users.remove(user)
    }
  })

  client.on("channelDelete", channel => gameStates.delete(channel.id))
}

async function guessGameState(vc) { // try and find out what the game state is. this is most commonly used when the bot restarts and has no idea whether it's mid-game or not.
  await vc.fetch();
  let voiceStates = vc.members.map(member => {
    if (member.voice.serverMute) return "mute";
    if (member.voice.serverDeaf) return "deaf";
    return null;
  }).sort(s => s), mostCommon = voiceStates.sort((a, b) => voiceStates.filter(s => s == a).length - voiceStates.filter(s => s == b).length).pop();
  if (mostCommon == "deaf") return "in-game";
  if (mostCommon == "mute") return "discussion";
  return "game-over";
}

module.exports.refreshPanel = async (hChannel, force = false) => {
  try {
    let messages = await hChannel.messages.fetch({ limit: 50 }), panels = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp), lastPanel = panels.last();
    
    if (
      !force &&
      !messages.find(m => m.author.id !== hChannel.client.user.id) && // check if all the messages are owned by the bot itself
      messages.size == panelEmbeds.length
    ) { // we try and use the existing panel instead of recreating it
      let changelogEmbed = panelEmbeds.find(e => e.title.includes("Changelog")), changelogIndex = panelEmbeds.indexOf(changelogEmbed);
      Array.from(messages.values())[changelogIndex].edit({ embed: changelogEmbed });
      return actionPanels.set(hChannel.guild.id, lastPanel.id);
    }

    while (messages.size == 50) {
      await hChannel.bulkDelete(messages);
      messages = await hChannel.messages.fetch({ limit: 50 });
      await pause(1000);
    }
    hChannel.bulkDelete(messages);
    
    for (const embed of panelEmbeds) lastPanel = await hChannel.send({ embed });
    actionPanels.set(hChannel.guild.id, lastPanel.id)
    await lastPanel.react("🔘");
    await pause(1000);
    await lastPanel.react("♻️");
    return true; // done!
  } catch(e) {
    return false; // something went wrong ;-;, maybe it's missing permission?
  }
}

module.exports.gameStates = gameStates;

const pause = ms => new Promise(resolve => setTimeout(resolve, ms)) // avoids rate limiting