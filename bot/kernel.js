const fs = require("fs");
const Discord = require("discord.js");

var DATA = {};

const Export = {
    getData: function(index){
        if(DATA[index] === undefined)
            DATA[index] = {};
        return DATA[index];
    },
    
    clearData: function(index){
        if(DATA[index] !== undefined){
            delete DATA[index];
        }
    },
    
    getChannelData: function(channelID){
        let data = this.getData("channelData");
        if(data[channelID] === undefined){
            data[channelID] = {};
        }
        return data[channelID];
    },
    
    clearChannelData: function(channelID){
        let data = this.getData("channelData");
        if(data[channelID] !== undefined){
            delete data[channelID];
        }
    },
    
    fundamental:{
        loadData: function(){
            let data = fs.readFileSync(__dirname + "/DATA.json", function(err){
                if(err){
                    console.log("Error: " +err); 
                    return;
                }
            });
           
            try{
                DATA = JSON.parse(data.toString());
            }
            catch(a){
                console.log("Error at parsing data");
            }
        },
       
        saveData: function(){
            fs.writeFileSync(__dirname + "/DATA.json", JSON.stringify(DATA), function(err){
                if(err){
                    console.log("Error: " +err); 
                    return;
                }
            });
        }
    },

    response:{
        simple: function(message, content){
            if(message === undefined)
            {
                console.log(content);
            }
            if(content && content.toString && content.toString() !== ""){
                message.channel.send(content.toString());
            }
        },
        attachment: function(message, link){
            if(message === undefined)
            {
                console.log(link);
            }
            if(link && link.toString && link.toString() !== ""){
                message.channel.send(new Discord.Attachment(link.toString()));
            }
        },
        embedImageUrl: function(message, link){
            if(message === undefined)
            {
                console.log(options);
            }
            if(typeof(link) == "string"){
                message.channel.send(new Discord.RichEmbed({image: {url: link}}));
            }
        },
        embed: function(message, options){
            if(message === undefined)
            {
                console.log(options);
            }
            if(typeof(options) === "object"){
                message.channel.send(new Discord.RichEmbed(options));
            }
        }
    },
    
    guild: {
        getMembers: function(guild){
            if(guild && guild.available)
            {
                return guild.members;
            }
            return null;
        },
        getPajacableMembers: function(guild){
            let members = this.getMembers(guild);
            if(members)
            {
                return members.filter(member => !member.user.bot && member.presence.status !== "offline" );
            }
            return false;
        }

    }


};

module.exports = Export;