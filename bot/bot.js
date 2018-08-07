const Discord   = require("discord.js");
const client    = new Discord.Client();

const Commands  = require("./commands.js");
const Kernel    = require("./kernel.js");
const Responces = require("./responces.js");

const fs = require('fs');

const PREFIX = "()";

function log(msg)
{
	fs.writeFile('./log.txt', (new Date()).toString() + "\t\t" + msg + "\r\n", {flag: "a"}, (err) => {
  		if (err) throw err;
	});
}

client.on("message", (message) => {

    //Check if author is a bot
    if (message.author.bot)
        return;


    // Check, if a message is a command
    if(message.content.startsWith(PREFIX)){
        let query = message.content.slice(PREFIX.length);
        Commands.handleQuery(query, message);
        return;
    }

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
});

let interval;

client.on("ready", () => {

    // Load JSON data
    Kernel.fundamental.loadData();

    // Load commands
    Commands.loadCommandsFromFile("./commands/utilities.js");
    Commands.loadCommandsFromFile("./commands/responces.js");
    Commands.loadCommandsFromFile("./commands/help.js");

    console.log("Ready");
	log("Ready");
	
	if(interval){
		clearInterval(interval);
		log("Cleared Logging Interval");
	}
	interval = setInterval(function(){
		log(client.status);
	}, 1000 * 60);
});

client.on("disconnect", () => {
	log("Disconnected")
});
client.on("reconnecting", () => {
	log("Reconnecting")
});
client.on("resume", () => {
	log("Resume")
});

log("Loaded");


module.exports = {
	login: function(){
		client.login(process.env.TOKEN);
	},
	log: log
}