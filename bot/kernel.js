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
            if(content && content.toString){
                message.channel.send(content);
            }
        }
    }
    


};

module.exports = Export;