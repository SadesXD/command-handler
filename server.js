const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Discord.Collection();

require("dotenv").config();
require("./Handlers/Commands.js")(client);
require("./Handlers/Events.js")(client);


client.login(process.env.TOKEN);