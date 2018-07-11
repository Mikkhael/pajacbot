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


    // Check, if pajac
    let pajacRegExp = /kto jest pajacem/i;
    if(pajacRegExp.test(message.content))
    {
        // Get all pajacable users
        let usersList = Kernel.guild.getPajacableMembers(message.guild);
        // CHeck, for errors
        if(usersList !== false)
        {
            // get random user
            let user = usersList.random().user;

            if(user)
                Kernel.responce.simple(message, user);
        }
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
    Commands.loadCommandsFromFile("./commands/responces.js");

    console.log("Ready");
});

///
if(!process.env.TOKEN)
{
    process.env.TOKEN = fs.readFileSync(".env").toString().slice("TOKEN=\"".length, -1);
}

client.login(process.env.TOKEN);