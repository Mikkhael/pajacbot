const express   = require("express");
const app       = express();


const bot       = require("./bot/bot.js");

const PORT = 80;

app.listen(80, function(){
    console.log(process.env.TOKEN);
});