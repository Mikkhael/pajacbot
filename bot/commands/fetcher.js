const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const SafeFetcher = require("../fetchers/safebooruFetcher.js");
const NekoFetcher = require("../fetchers/nekoFetcher.js");

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
                    SafeFetcher.getImage(args.tags, function(image){
                        image.send(message.channel, "No results found \:\(");
                    });
                },
                "Sends a random image from safebooru, with optionaly specified *tags* (space seperated)"
            )
        ],
        "Sends a random image from safebooru"
    ),
    new Commands.Command("safebooru_overload",
        [
            new Commands.CommandTemplate(
                [],
                function (args, message) {
                    let isEnabled = Kernel.getChannelData(message.channel.id).safebooruOverloadEnabled;
                    if(isEnabled)
                    {
                        Kernel.getChannelData(message.channel.id).safebooruOverloadEnabled = undefined;
                        Kernel.response.simple(message, "Safebooru overload is disabled.");
                    }else{
                        Kernel.getChannelData(message.channel.id).safebooruOverloadEnabled = true;
                        Kernel.response.simple(message, "Safebooru overload is enabled.");
                    }
                    Kernel.fundamental.saveData();
                },
                "Enables or disables safebooru overload.\nIf enabled, every word in the messeges send in this channel will be considered as a tag for a safebooru image."
            )
        ],
        "Enables or disables safebooru overload"
    ),
    new Commands.Command("do",
        [
            new Commands.CommandTemplate(
                [
                    new Commands.TemplatElementeGenerator.Enum("type", Object.keys(NekoFetcher.ActionsEndpoints)),
                    new Commands.TemplatElementeGenerator.Rest("object", true)
                ],
                function (args, message) {
                    const subject = message.author.toString();
                    const action  = args.type + (args.type[args.type.length-1] === 's' ? "es" : "s");
                    const object  = args.object || "";
                    
                    const description = subject + " " + action + " " + object;
                    
                    NekoFetcher.getAction(args.type, function(action){
                        action.send(message.channel, undefined, {description: description});
                        if(message.deletable){
                            message.delete();
                        }
                    });
                },
                "Performes an specified action upon a given *object*, for example, an user."
            )
        ],
        "Performes an action, accompanied with an appropiate gif."
    )
]