const Kernel = require("./kernel.js");


const Export = {
    getMatching: function(message)
    {
        // Get responses from database
        let responses = Kernel.getData("responsePresets");

        // Set response modifiers
        let modifiers = {
            caps:       message === message.toUpperCase() && message !== message.toLowerCase(),
            capital:    message[0] === message[0].toUpperCase() && message[0].toLowerCase() !== message[0].toUpperCase(),
            dots:       message.slice(-3) === "..."
        }

        // Format message to find the match
        message = message.toLowerCase();
        if(modifiers.dots) message = message.slice(0,-3);

        for(let key in responses){
            // Check, if matches
            if(key === message){
                let res = responses[key];

                if(res === undefined)
                    break;

                // Check, if should be formated
                if(res[0] === "!")
                {
                    res = res.slice(1);
                }
                // else, format the response
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
    },
    set: function(message, response, nomod = false){
        let responses = Kernel.getData("responsePresets");
        
        responses[message.toLowerCase()] = (nomod ? "!" : "") + (response[0] === "!" ? "\\" + response : response);
        Kernel.fundamental.saveData();
    },
    delete: function(message){
        let responses = Kernel.getData("responsePresets");
        
        if(responses[message.toLowerCase()]){
            delete responses[message.toLowerCase()];
        }
        Kernel.fundamental.saveData();
    }
};

module.exports = Export;