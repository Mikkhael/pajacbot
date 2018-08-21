const request = require("request");
const fs = require("fs");

const Discord = require("discord.js");

const url = "https://safebooru.org/index.php?page=dapi&s=post&q=index";

const postCountRegExp = /<posts[^>]*? count="(.*?)"/;
const fileUrlRegExp   = /<post[^>]*? file_url="(.*?)"/;
const sampleUrlRegExp = /<post[^>]*? sample_url="(.*?)"/;
const idRegExp = /<post[^>]*? id="(.*?)"/;

function getRequestUrl(limit=0, page=0, tags = []){
    return url + "&limit=" + limit + "&pid=" + page + "&tags=" + encodeURI(tags.join("+"));
}

function getPostsCount(tags = [], callback){
    request(getRequestUrl(0,0,tags), function(err, res, body){
        if(err){
            console.log(err);
            callback(0);
            return;
        }
        let result = postCountRegExp.exec(body);
        if(!result){
            callback(0);
            return;
        }
        callback(+result[1]);
    });
}




function Image(fileUrl, sampleUrl, id, tags, count, index, isOverMaxPageCount){
    this.fileUrl    =   fileUrl;
    this.sampleUrl  =   sampleUrl;
    this.id         =   id;
    this.tags       =   tags;
    this.count      =   count;
    this.index      =   index;
    this.isOverMaxPageCount = isOverMaxPageCount;
}

Image.prototype.getEmbedMessage = function(){
    let embed = {};
    
    // Sample url is required
    if(!this.sampleUrl){
        return null;
    }
    
    embed.image = {url: this.sampleUrl};
    embed.url = this.sampleUrl;
    embed.title = this.sampleUrl;
    
    // Link to the full image
    if(this.fileUrl){
        embed.url = this.fileUrl;
        embed.title = this.fileUrl;
    }
    
    // Tags used in the search for the description
    if(this.tags && this.tags.join){
        embed.description = this.tags.join(" ");
    }
    
    // Id and number of valid images
    embed.footer = {text: 
        (this.count && this.index ? this.index + "/" + this.count + (this.isOverMaxPageCount ? "+": "") : "") + 
        (this.id ? "  | id: " + this.id : "")
    };
    
    return embed;
}

Image.prototype.send = function(channel, fallbackMessage, embedOverride = {}){
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



const maxPageCount = 3000;

function getImage(tags, callback, minCount = 0){
    if(tags.join === undefined){
        tags = [tags];
    }
    
    getPostsCount(tags, function(count){
        
        if(!count || count < minCount){
            callback(new Image());
            return;
        }
        
        if(count > maxPageCount){
            count = maxPageCount;
        }
        
        let imageIndex = Math.floor(Math.random()*count);
        request(getRequestUrl(1, imageIndex, tags), function(err, res, body){
             if(err){
                console.log(err);
                callback(new Image());
                return;
             }
             
             let fileUrl    = fileUrlRegExp.exec(body);
             let sampleUrl  = sampleUrlRegExp.exec(body);
             let id         = idRegExp.exec(body);
             
             if(!sampleUrl){
                 callback(new Image());
                 return;
             }
             
             callback(new Image(
                 "https:" + fileUrl[1],
                 "https:" + sampleUrl[1],
                 id[1],
                 tags,
                 count,
                 imageIndex,
                 count >= maxPageCount
             ));
        });
        
    });
}

module.exports = {
    Image,
    
    getImage
}