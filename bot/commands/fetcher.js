const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const SafeFetcher = require("../fetchers/safebouruFetcher.js");

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
    ),
    new Commands.Command("safebouru_overload",
        [
            new Commands.CommandTemplate(
                [],
                function (args, message) {
                    let isEnabled = Kernel.getChannelData(message.channel.id).safebouruOverloadEnabled;
                    if(isEnabled)
                    {
                        Kernel.getChannelData(message.channel.id).safebouruOverloadEnabled = undefined;
                        Kernel.response.simple(message, "Safebouru overload is disabled.");
                    }else{
                        Kernel.getChannelData(message.channel.id).safebouruOverloadEnabled = true;
                        Kernel.response.simple(message, "Safebouru overload is enabled.");
                    }
                    Kernel.fundamental.saveData();
                },
                "Enables or disables safebouru overload.\nIf enabled, every word in the messeges send in this channel will be considered as a tag for a safebouru image."
            )
        ],
        "Enables or disables safebouru overload"
    )
]