const Kernel = require("./kernel.js");


const Export = {
    getMatching: function(message)
    {
        // Get responces from database
        let responces = Kernel.getData("responcePresets");

        // Set responce modifiers
        let modifiers = {
            caps:       message === message.toUpperCase() && message !== message.toLowerCase(),
            capital:    message[0] === message[0].toUpperCase() && message[0].toLowerCase() !== message[0].toUpperCase(),
            dots:       message.slice(-3) === "..."
        }

        // Format message to find the match
        message = message.toLowerCase();
        if(modifiers.dots) message = message.slice(0,-3);

        for(let key in responces){
            // Check, if matches
            if(key === message){
                let res = responces[key];

                // Check, if should be formated
                if(res[0] === "!")
                {
                    res = res.slice(1);
                }
                // else, format the responce
                else
                {
                    if(modifiers.caps)
                    {
                        res = res.toUpperCase();
                    }else if(modifiers.capital){
                        res += ".";
                    }
    
                    if(modifiers.dots){
                        res = "..." + res;
                    }
                }
                
                return res;
            }
        }

        return false;
    }
};

module.exports = Export;