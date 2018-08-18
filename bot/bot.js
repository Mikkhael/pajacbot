const Discord   = require("discord.js");
const client    = new Discord.Client();

const Commands  = require("./commands.js");
const Kernel    = require("./kernel.js");
const Responces = require("./responses.js");

const JejaFetcher = require('./jejaFetcher.js');
const RedditFetcher = require('./redditFetcher.js');
const SafeFetcher = require('./safebouruFetcher.js');

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

	
	// Check, if message is an image
	if(message.attachments && message.attachments.array().length > 0){
		log("Attachment recived");
		return;
	}
	
	if(message.content){
		
		// Check, if a message is a command
		if(message.content.startsWith(PREFIX)){
			let query = message.content.slice(PREFIX.length);
			Commands.handleQuery(query, message);
			return;
		}

		// Check, if message has a preset response
		let response = Responces.getMatching(message.content);
		if(response !== false)
		{
			Kernel.response.simple(message, response);
			return;
		}


		// Check, if pajac
		const pajacRegExp = /kto jest pajacem/i;
		if(pajacRegExp.test(message.content))
		{
			// Get all pajacable users
			let usersList = Kernel.guild.getPajacableMembers(message.guild);
			// Check, for errors
			if(usersList !== false)
			{
				// get random user
				let user = usersList.random().user;

				if(user)
					Kernel.response.simple(message, user);
			}
			return;
		}
		
		
		////// Other utilities //////
		
		// Meme
		const memeRegExp = /(dobry|słaby) mem/ig;
		let memeMatch;
		while(memeMatch = memeRegExp.exec(message.content)){
			if(memeMatch[1] === "dobry"){
				RedditFetcher.fetchImage("memes", {}, function(url){
					Kernel.response.embed(message, {image: {url: url}});
				});
			}else{
				JejaFetcher.fetchImage({}, function(url){
					Kernel.response.attachment(message, url);
				});
			}
		}
		
		// Safebouru catgirls
		const catgirlRegExp = /(?:(?:kobieta|zmywara|zmywarka|pralka|dziewczyna|dziwczynka|dziewczę|laska|loszka|dziołcha|dziołszka|dziewka|niewiasta|białogłowa)[ \-\_]?(?:kot|kotek)|(?:cat|kitty)[ \-\_]?(?:girl|woman)|neko)/ig;
		while(catgirlRegExp.exec(message.content)){
			let tags = [
				['catgirl'],
				['cat_girl'],
				['cat_ears', 'cat_tail']
			];
			let tag = tags[Math.floor(Math.random()*tags.length)];
			SafeFetcher.getImage(tag, function(image){
				Kernel.response.embedImageUrl(message, image);
			})
		}
	}
    
});

let interval;

client.on("ready", () => {

    // Load JSON data
    Kernel.fundamental.loadData();

    // Load commands
    Commands.loadCommandsFromFile("./commands/utilities.js");
    Commands.loadCommandsFromFile("./commands/responses.js");
    Commands.loadCommandsFromFile("./commands/fetcher.js");
    Commands.loadCommandsFromFile("./commands/help.js");

    console.log("Ready");
	log("Ready");
	
	if(interval){
		clearInterval(interval);
		log("Cleared Logging Interval");
	}
	interval = setInterval(function(){
		if(!client){
			log("No client");
		}
		else{
			log(client.user ? (client.user.presence && client.user.presence.status) : "no user");
		}
	}, 1000 * 60 * 60);
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
client.on("error", (error) => {
	log("Error\r\n" + error.message);
});

log("Loaded");


module.exports = {
	login: function(){
		client.login(process.env.TOKEN);
	},
	log: log
}