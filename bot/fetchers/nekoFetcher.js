const request = require("request");
const fs = require("fs");

const Discord = require("discord.js");

const baseURL = "https://nekos.life/api/v2";

const ImageEndpoints = {
    "neko": "/img/neko",
    "gif": "/img/ngif",
    "cat": "/img/meow",
    "fox": "/img/fox_girl",
    "smug": "/img/smug",
    "baka": "/img/baka",
    "kemonomimi": "/img/kemonomimi",
    "lizard": "/img/lizard",
    "holo": "/img/holo",
}

const ActionsEndpoints = {
    "tickle": "/img/tickle",
    "slap": "/img/slap",
    "poke": "/img/poke",
    "pat": "/img/pat",
    "kiss": "/img/kiss",
    "hug": "/img/hug",
    "feed": "/img/feed",
    "cuddle": "/img/cuddle",
}

const UtilityEndpoints = {
    "why": "/why",
    "catText": "/cat",
    "OwOify": "/owoify",
    "8Ball": "/8ball",
    "fact": "/fact",
    "chat": "/chat",
}

function Image(url, type){
    this.url = url;
    this.type = type;
}

Image.prototype.getEmbedMessage = function(){
    let embed = {};
    
    if(!this.url || !this.type){
        return null;
    }
    
    embed.url = this.url;
    embed.image = {url: this.url};
    
    switch(this.type){
        case "neko" :{
            embed.title = "ヽ(^‥^=ゞ)";
            break;
        }
        case "gif" :{
            embed.title = "(^･o･^)ﾉ”";
            break;
        }
        case "cat" :{
            embed.title = "(๑ↀᆺↀ๑) Wow! Such real...";
            break;
        }
        case "kemonomimi" :{
            embed.title = "(ㅇㅅㅇ❀)";
            break;
        }
        case "fox" :{
            embed.title = "｡＾･ｪ･＾｡";
            break;
        }
        default :{
            embed.title = this.type[0].toUpperCase() + this.type.slice(1);
        }
    }
    
    return embed;
}

Image.prototype.send = function(channel, fallbackMessage, embedOverride){
    let embed = this.getEmbedMessage();
    if(embed){
        if(embedOverride){
            Object.assign(embed, embedOverride);
        }
        channel.send(new Discord.RichEmbed(embed));
        return;
    }
    if(fallbackMessage){
        channel.send(fallbackMessage);
    }
}

function getImage(type, callback){
    if(ImageEndpoints[type] === undefined){
        callback(new Image());
        return;
    }
    
    request(baseURL + ImageEndpoints[type],function(err, res, body){
        if(err){
            callback(new Image());
            console.log(err);
            return;
        }
        
        let url = JSON.parse(body).url;
        callback(new Image(url, type));
    });
}

function Action(url, type){
    this.url = url;
    this.type = type;
}

Action.prototype.getEmbedMessage = function(){
    let embed = {};
    
    if(!this.url || !this.type){
        return null;
    }
    
    embed.image = {url: this.url};
    return embed;
}

Action.prototype.send = function(channel, fallbackMessage, embedOverride){
    let embed = this.getEmbedMessage();
    if(embed){
        if(embedOverride){
            Object.assign(embed, embedOverride);
        }
        channel.send(new Discord.RichEmbed(embed));
        return;
    }
    if(fallbackMessage){
        channel.send(fallbackMessage);
    }
}

function getAction(type, callback){
    if(ActionsEndpoints[type] === undefined){
        callback(new Action());
        return;
    }
    
    request(baseURL + ActionsEndpoints[type],function(err, res, body){
        if(err){
            callback(new Action());
            console.log(err);
            return;
        }
        
        let url = JSON.parse(body).url;
        callback(new Action(url, type));
    });
}

module.exports = {
    Image,
    getImage,
    Action,
    getAction,
    ImageEndpoints,
    ActionsEndpoints,
    UtilityEndpoints
}