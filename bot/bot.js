const Discord   = require("discord.js");
const client    = new Discord.Client();

const Commands  = require("./commands.js");

const fs        = require('fs');

client.on("message", (message) => {
   
   
   //Check if author is a bot
   if(message.author.bot)
       return;
  
   
});



client.on("ready", ()=>{
    
    Commands.loadCommandsFromFile("./commands/utilities.js");

    Commands.handleQuery("roll");
    Commands.handleQuery("roll 2");
    Commands.handleQuerycls("roll 1000 2000");

    console.log("Ready");
})

Commands.loadCommandsFromFile("./commands/utilities.js");

Commands.handleQuery("roll");
Commands.handleQuery("roll 2");
Commands.handleQuery("roll 10 -\"10");

Commands.handleQuery("echo Hello");
Commands.handleQuery("echo \"Hello\"");
Commands.handleQuery("echo Hello World!!");


console.log("Ready");

///
//client.login(process.env.TOKEN);