const request = require("request");

// RegExp used to get the link to the meme from the html page
const imageLinkSearchRegExp = new RegExp('//pobierak\.jeja\.pl/images/(?:.+?(?="))', "g");

// Returns link to a random meme from a html page
function getRandomImageLinkFromHtml(html, allowGifs = true, allowMp4 = true){
    let results = html.match(imageLinkSearchRegExp);
    return "https:" + results[Math.floor(Math.random()*results.length)];
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
    maxPage: 20000,
    allowGifs: true,
    allowMp4: true
}

// Passes a link to a random meme as a parameter to the callback
function fetchRandomMemeLink(options, callback)
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
    fetchRandomMemeLink
}