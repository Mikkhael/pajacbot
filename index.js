const express   = require("express.js");
const app       = express();


const PORT = 80;

app.listen(80, function(){
    console.log("Server listening on port " + PORT);
});