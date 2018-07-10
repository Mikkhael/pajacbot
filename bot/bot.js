const Discord   = require("discord.js");
const client    = new Discord.Client();

const Commands  = require("./commands.js");
const Kernel    = require("./kernel.js");
const Responces = require("./responces.js");

const fs = require('fs');

const PREFIX = "()";

client.on("message", (message) => {


    //Check if author is a bot
    if (message.author.bot)
        return;

    // Check, if message has a preset responce
    let responce = Responces.getMatching(message.content);
    if(responce !== false)
    {
        Kernel.responce.simple(message, responce);
        return;
    }

    // Check, if a message is a command
    if(message.content.startsWith(PREFIX)){
        let query = message.content.slice(PREFIX.length);
        Commands.handleQuery(query, message);
    }
});



client.on("ready", () => {

    // Load JSON data
    Kernel.fundamental.loadData();

    // Load commands
    Commands.loadCommandsFromFile("./commands/utilities.js");

    console.log("Ready");
});

///
client.login(process.env.TOKEN);