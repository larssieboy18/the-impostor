// embeds for the host panel
module.exports.panelEmbeds = [
  {
    title: "How to Host",
    description: [
      "1. Join the `Create new game`-voice channel to create your own voice channel.",
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
    title: "Changelog December",
    description: [
      "[•](https://github.com/biaw/the-impostor/commit/75e64c97440d6789367e0ae986fe31bbc5502e3d) Fixed a bug that have existed for a very very long time. The host can now actually control the game without moderation powers.",
      "[•](https://github.com/biaw/the-impostor/commit/d55ee4b4addbd69a7107e1b0b28dd9b1d4565cb5) The hosting channel will now copy category permissions."
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
];