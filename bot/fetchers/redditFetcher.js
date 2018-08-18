const request = require("request");

const fetchPostDefaultOptions = {
    limit: 500,
    validator: null,
    nsfw: true,
    sort: "hot"
}

function getSubredditJsonUrl(subreddit, sort = "hot"){
    return `https://www.reddit.com/r/${subreddit}/${sort}/.json`;
}

function fetchImage(subreddit, options = {}, callback)
{
    options = Object.assign({}, fetchPostDefaultOptions, options);
    let url = getSubredditJsonUrl(subreddit, options.sort) + "?limit=" + options.limit;
    request(url, function(err, res, body){
        if(err){
            console.log(err);
            callback(undefined);
            return;
        }
        
        let posts = JSON.parse(body).data.children;
        
        if(posts.length < 1)
        {
            callback(undefined);
            return;
        }
        
        let randomPostIndex = Math.floor(Math.random()*posts.length);
        for(let i=0; i < posts.length; i++){
            let post = posts[(i + randomPostIndex) % posts.length].data;
            let imageUrl;
            if(post.preview && post.preview.images && post.preview.images.length > 0){
                imageUrl = post.preview.images[0].source.url;
            }
            
            if(imageUrl === undefined){
                continue;
            }
            if(!options.nsfw && post.over_18){
                continue;
            }
            if(options.validator && !options.validator(post)){
                continue;
            }
            
            callback(imageUrl);
            return;
        }
        callback(undefined);
    });
}

module.exports = {
    fetchImage
}