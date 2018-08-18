const request = require("request");
const fs = require("fs");

const url = "https://safebooru.org/index.php?page=dapi&s=post&q=index";

const postCountRegExp = /<posts[^>]*? count="(.*?)"/;
const fileUrlRegExp   = /<post[^>]*? file_url="(.*?)"/;

function getRequestUrl(limit=0, page=0, tags = []){
    return url + "&limit=" + limit + "&pid=" + page + "&tags=" + encodeURI(tags.join("+"));
}

function getPostsCount(tags = [], callback){
    request(getRequestUrl(0,0,tags), function(err, res, body){
        if(err){
            console.log(" ---- ERROR 1----");
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

const maxPageCount = 3000;

function getImage(tags, callback){
    if(tags.join === undefined){
        tags = [tags];
    }
    
    getPostsCount(tags, function(count){
        
        if(!count){
            callback(undefined);
            return;
        }
        
        if(count > maxPageCount){
            count = maxPageCount;
        }
        
        let imageIndex = Math.floor(Math.random()*count);
        request(getRequestUrl(1, imageIndex, tags), function(err, res, body){
             if(err){
                console.log(" ---- ERROR 2----");
                console.log(err);
                callback(undefined);
                return;
             }
             
             let result = fileUrlRegExp.exec(body);
             if(!result){
                 callback(undefined);
                 return;
             }
             callback("https:"+result[1]);
        });
        
    });
}

module.exports = {
    getImage
}