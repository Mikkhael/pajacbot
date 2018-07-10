const fs = require("fs");

var DATA = {};

const Export = {
    getData: function(index){
        if(DATA[index] === undefined)
            DATA[index] = {};
        return DATA[index];
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

    responce:{
        simple: function(message, content){
            if(message === undefined)
            {
                console.log(content);
            }
            if(content && content.toString && content.toString() !== ""){
                message.channel.send(content.toString());
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