const express   = require("express");
const http      = require("http");
const app       = express();


const bot       = require("./bot/bot.js");

const PORT  = process.env.PORT || 3000;
const URL   = process.env.PROJECT_DOMAIN ? `http://${process.env.PROJECT_DOMAIN}.glitch.me/` : undefined;

const pinging       = false;
const pingInterval  = 4 * 60 * 1000;

// Waking up
app.get('/', function(request, responce){
    responce.send("OK");
    responce.end();
    if(URL && !pinging)
    {
        pinging = setTimeout(function(){
            pinging = false;
            http.get(URL);
        }, pingInterval);
    }
});

app.listen(PORT, function(){
    console.log("Listening on port " + PORT);
});