const request = require("request");

// RegExp used to get the link to the meme from the html page
const imageLinkSearchRegExp = new RegExp('pobierak\.jeja\.pl/images/(?:.+?(?="))', "g");

// Returns link to a random meme from a html page
function getRandomImageLinkFromHtml(html, allowGifs = true, allowMp4 = false){
    let results = html.match(imageLinkSearchRegExp);
    results = results.filter(url => {
       let ext = url.slice(-4);
       return ext === ".jpg" || ext === ".png" || (allowGifs && ext === ".gif") || (allowMp4 && ext === ".mp4");
    });
    if(results.length == 0){
        return undefined;   
    }
    return "https://" + results[Math.floor(Math.random()*results.length)];
}

// Returns a link to a givenpage
function getPageLink(page)
{
    return `https://memy.jeja.pl/nowe,0,0,${page}.html`;
}

// Returns a link to a random page
function getRandomPageLink(maxPage = 20000)
{
    return getPageLink(Math.floor(Math.random() * maxPage));
}

const fetchRandomMemeDefaultOptions = {
    maxPage: 1000,
    allowGifs: true,
    allowMp4: false
}

// Passes a link to a random meme as a parameter to the callback
function fetchImage(options, callback)
{
    options = Object.assign({}, fetchRandomMemeDefaultOptions, options);
    request(getRandomPageLink(options.maxPage), function(err, res, body){
        if(err){
            console.log(err);
            return;
        }
        let link = getRandomImageLinkFromHtml(body, options.allowGifs, options.allowMp4);
        callback(link);
    });
}

module.exports = {
    fetchImage
}