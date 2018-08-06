const express   = require("express");
const http      = require("http");
const app       = express();


const bot       = require("./bot/bot.js");

const PORT      = process.env.PORT || 3000;
const URL       = undefined //process.env.PROJECT_DOMAIN ? `http://${process.env.PROJECT_DOMAIN}.glitch.me/` : undefined;

var   pinging       = false;
const pingInterval  = 3 * 60 * 1000;

function sendPing()
{
    if(URL && !pinging)
    {
        console.log("ping");
        pinging = setTimeout(function(){
            pinging = false;
            http.get(URL);
            console.log("pong");
        }, pingInterval);
    }
}

// Waking up
app.get('/', function(request, responce){
    responce.send("OK");
    responce.end();
    sendPing();
});

app.listen(PORT, function(){
    console.log("Listening on port " + PORT);
    sendPing();
});