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
    title: "Changelog October",
    description: [
      "[•](https://github.com/biaw/the-impostor/issues?q=is%3Aissue+is%3Aclosed+-label%3Awontfix) Made a changelog that will reset monthly. (Yeah, you're looking at it!)",
      "[•](https://github.com/biaw/the-impostor/issues/3) Introduced a new neat help command with detailed description of each command.",
      "[•](https://github.com/biaw/the-impostor/issues/6) The bot will no longer randomly refresh the panel. It will now only refresh when starting the bot and when refreshing it manually.",
      "[•](https://github.com/biaw/the-impostor/issues/7) Introduced a new toggle system. You now only have one button instead of two so you don't accidentally misclick.",
      "[•](https://github.com/biaw/the-impostor/issues/8) The bot will now show how many games are being played with the bot in its presence.",
      "[•](https://github.com/biaw/the-impostor/issues/15) When leaving a game VC, the bot will try and unmute/undeafen you. Also, when joining a game VC, the bot will treat you as a ghost and mute you if there's a discussion.",
      "[•](https://github.com/biaw/the-impostor/issues/23) When the bot restarts, it will not auto-detect the hosting panel and not regenerate it."
    ].join("\n\n"),
    color: 0x1ABC9C
  },
  {
    title: "Host Actions",
    description: [
      "🔘 **SWITCH:** Switch between in-game and discussion.",
      "♻️ **GAME-OVER:** Unmute and undeafen everyone."
    ].join("\n"),
    color: 0xF1C40F
  }
]