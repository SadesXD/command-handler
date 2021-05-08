module.exports = async (client) => {
  
  client.user.setActivity("Tutorial Discord Bot", {
    type: "WATCHING"
  });
  
  console.log(`${client.user.tag} is ready`);
}