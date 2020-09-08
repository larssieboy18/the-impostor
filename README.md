# The Impostor BIAW

A simple Discord.js-bot to help you host Among us-games.

## Features

### Anyone can host
That's right. Literally anyone can host their own game with this bot. The bot handles everything, and as long as everyone has read-access to the hosting panel and can join the "Create new game"-voice channel, the bot will do the rest.

### The host can control the game

The host have some tools available. They can easily mute and unmute everyone in the voice channel with a simple left-click on Discord. It's recommended for the host to either be an Alt+Tab-god, or to have two monitors.

![The Host panel](https://i.promise.solutions/wCOvWB.png)

### No database or external packages required

The code is made in discord.js (version 12), and some additional packages makes it faster (works with discord.js).

## Requirements

- Node version 12 (confirmed working on v12.16.1)
- npm (usually comes with Node, doesn't really matter what version afaik)
- a Discord bot token, and having the bot in your server

### How to setup

You will have to do all of this ONCE.

- Rename `config.example.json` to `config.json` and fill in the values.
  - `token`: Your Discord bot token
  - `guildid`: The guild ID of your server
  - `guestroleid` (optional): The role you want to give people people who join the server 
  - `hostpanelchannelid`: The channel ID of where you want the host panel to be put
  - `newgamevcid`: The voice channel ID of what channel people can join to create their own game
  - `gamecategoryid`: The channel category ID of where the game voice channels will be created
  - `gameruleschannelid` (optional): The channel where the custom unofficial game rules are, if you have a channel for that.
- Do `npm i` inside the folder, and wait for it to finish.

After this is done, you can start the bot with `node .`

## License

We use the MIT-license.

> A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source. There are many variations of this license in use.

Fetched from [TLDRLegal](https://tldrlegal.com/license/mit-license), please also read the [license](https://github.com/gleeny/24-7/blob/master/LICENSE) if you plan on using the source code. This is only a short summary. Please also take note of that we are not forced to help you, and we won't help you host it yourself as we do not recommend you doing so.