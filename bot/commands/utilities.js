const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");

module.exports = [
    new Commands.Command("roll",
        [
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Integer("number", true)
                ],
                function (args, message) {
                    if (args.number === undefined)
                        args.number = 100;
                    let content = Math.floor(Math.random() * args.number) + 1;
                    Kernel.response.simple(message, content);
                },
                "Returns a random integer beetween 1 and specified number, implicitly 100 (inclusive)"
            ),
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Integer("from"),
                    Commands.TemplatElementeGenerator.Integer("to")
                ],
                function (args, message) {
                    let content = Math.floor(Math.random() * (args.to - args.from + 1)) + args.from;
                    Kernel.response.simple(message, content);
                },
                "Returns a random integer from a specified range (inclusive)"
            )
        ],
        "Returns a random integer"
    ),
    new Commands.Command("echo",
        [
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Rest("message")
                ],
                function (args, message) {
                    Kernel.response.simple(message, args.message);
                    if(message.deletable){
                        message.delete();
                    }
                },
                "Says a message"
            )
        ],
        "Says a message"
    )
]