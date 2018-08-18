const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const SafeFetcher = require("../safebouruFetcher.js");

module.exports = [
    new Commands.Command("safe",
        [
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Rest("tags", true)
                ],
                function (args, message) {
                    if(!args.tags){
                        args.tags = [];
                    }
                    else{
                        args.tags = args.tags.split(' ');
                    }
                    SafeFetcher.getImage(args.tags, function(imageUrl){
                        if(!imageUrl){
                            Kernel.response.simple(message, "No results found");
                        }else{
                            Kernel.response.embedImageUrl(message, imageUrl); 
                        }
                    });
                },
                "Sends a random image from safebouru, with optionaly specified *tags* (space seperated)"
            )
        ],
        "Sends a random image from safebouru"
    )
]