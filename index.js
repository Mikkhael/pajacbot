const express   = require("express");
const app       = express();


const bot       = require("./bot/bot.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Listening on port " + PORT);
});