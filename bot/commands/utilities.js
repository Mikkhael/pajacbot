const Commands = require("../commands.js");

module.exports = [
    new Commands.Command("roll",
        [
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Integer("number", true)
                ],
                function(args)
                {
                    if(args.number === undefined)
                        args.number = 100;
                    console.log( Math.floor(Math.random() * args.number) + 1 );
                },
                "Returns a rundom integer beetween 1 and specified number, implicitly 100 (inclusive)"
            ),
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Integer("from"),
                    Commands.TemplatElementeGenerator.Integer("to")
                ],
                function(args)
                {
                    if(args.number === undefined)
                        args.number = 100;
                    console.log( Math.floor(Math.random() * args.number) + 1 );
                },
                "Returns a rundom integer from a specified range (inclusive)"
            )
        ],
        "Returns a rundom integer"
    )
]