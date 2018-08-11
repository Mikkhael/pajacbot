const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const Responces = require("../responses.js");

module.exports = [
    new Commands.Command("response",
        [
            new Commands.CommandTemplate(
                [
                   new Commands.TemplatElementeGenerator.Static("set"),
                   new Commands.TemplatElementeGenerator.Any("message"),
                   new Commands.TemplatElementeGenerator.Any("response"),
                   new Commands.TemplatElementeGenerator.Static("nomod", true)
                ],
                function (args, message) {
                    Responces.set(args.message, args.response, args.nomod);
                    Kernel.response.simple(message, `${args.nomod ? "Non-modificable r" : "R"}esponce set\n\tfor: ${args.message.toLowerCase()}\n\tas:  ${args.response}`);
                },
                "Sets a new *response* for a given *message*\nIf *nomod* is set, the response won't be modified. Use for links."
            ),
            new Commands.CommandTemplate(
                [
                   new Commands.TemplatElementeGenerator.Static("delete"),
                   new Commands.TemplatElementeGenerator.Any("message")
                ],
                function (args, message) {
                    Responces.delete(args.message);
                    Kernel.response.simple(message, `Deleted response for ${args.message}`);
                },
                "Deletes a preset response for a given *message*"
            )
        ],
        "Sets or deletes preset responses"
    )
]