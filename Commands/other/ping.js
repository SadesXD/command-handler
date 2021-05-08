const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Show user ping",
  usage: "-ping",
  aliases: ["beep"],
  permissions: [
    "ADMINISTRATOR"
  ],
  cooldown: 10000,
  run: async (client, message, args) => {
    return message.channel.send("Pongg....");
  }
}