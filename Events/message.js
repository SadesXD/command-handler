const { prefix, logs } = require("../config.json");
const { Permissions } = require("discord.js");

module.exports = (client, message) => {
  
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  
  if(message.mentions.has(client.user.id)) {
    return message.channel.send(`Hey ${message.author.tag}, My prefix is: ${prefix}`);
  }
  
  if(!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  if(!command) return;
  
  let commandFile = client.commands.get(command) || client.aliases.get(command);
  if(!commandFile) return;
  
  // Permissions Handler
  let CommandPermission = commandFile.permissions;
  for(let i = 0; i < CommandPermission.length; i++) {
    let list = Object.keys(Permissions.FLAGS);
    // Permissions Flags list: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    
    if(!list.some((perms) => perms.includes(CommandPermission[i]))) {
      throw new Error(`Permissions Flags [${CommandPermission[i]}] for Command: ${commandFile.name} is not listed`);
    } else if (!message.member.hasPermission(CommandPermission[i])) {
      return message.channel.send(`Sorry dude, You need **${CommandPermission[i].split("_").join(" ")}** before using this command`);
    }
  }
  
  //Cooldown Handler
  let userTime = client.cooldown.get(message.author.id + commandFile.name);
  let timeout = commandFile.cooldown;
  let cooldown_time = timeout - (Date.now() - userTime);
  
  let times = getDuration(cooldown_time);
  
  if(cooldown_time > 0 && times) {
    setTimeout(() => {
      client.cooldown.delete(message.author.id + commandFile.name);
    }, cooldown_time);
    
    return message.channel.send(`Calm down dude, You need **${times}** more for using this command`);
  }
  
  client.cooldown.set(message.author.id + commandFile.name, Date.now());
  
  try {
    commandFile.run(client, message, args);
  } catch(error) {
    console.log(error.message);
  } finally {
    client.channels.cache.get(logs).send(`User: ${message.author.tag}, Using Command: ${command}`);
  }
  
}

function getDuration(ms) {
  
  if(ms === 0) return false
  
  let date = new Date(ms);
  let seconds = date.getUTCSeconds() ? date.getUTCSeconds() + " Seconds" : "";
  let minutes = date.getUTCMinutes() ? date.getUTCMinutes() + " Minutes, " : "";
  let hours = date.getUTCHours() ? date.getUTCHours() + " Hours, " : "";
  let days = date.getUTCDate() - 1 ? date.getUTCDate() - 1 + " Days, " : "";
  
  let time = days + hours + minutes + seconds;
  if(time === "") return false;
  
  return time;
}
