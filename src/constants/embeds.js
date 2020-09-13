const config = require("../../config.json")

// embeds for the host panel
module.exports.panelEmbeds = [
  {
    title: "How to Host",
    description: [
      `1. Join the \`Create new game\`-voice channel to create your own voice channel.`,
      "2. Get educated on the host actions below before starting your first game.",
      "3. Invite some friends to join you and give them the game code for the game."
    ].filter(s => s).join("\n"),
    color: 0x3498DB
  },
  {
    title: "When someone is killed",
    description: [
      "To mark someone as dead, server mute them once there's a discussion.",
      "**PS!** Do NOT server mute them in-game, it would alert the other crewmates that they are dead!"
    ].join("\n"),
    color: 0xE74C3C
  },
  {
    title: "Host Actions",
    description: [
      "🔇 **IN-GAME:** Crewmates are deafened, and ghosts can talk to each other.",
      "🔊 **DISCUSSION:** Crewmates are undeafened, and ghosts are muted.",
      "♻️ **GAME-OVER:** Unmute and undeafen everyone."
    ].join("\n"),
    color: 0xF1C40F
  }
]