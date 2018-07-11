const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const Responces = require("../responces.js");

module.exports = [
    new Commands.Command("responce",
        [
            new Commands.CommandTemplate(
                [
                   new Commands.TemplatElementeGenerator.Static("set"),
                   new Commands.TemplatElementeGenerator.Any("message"),
                   new Commands.TemplatElementeGenerator.Any("responce"),
                   new Commands.TemplatElementeGenerator.Static("nomod", true)
                ],
                function (args, message) {
                    Responces.set(args.message, args.responce, args.nomod);
                    Kernel.responce.simple(message, `${args.nomod ? "Non-modificable r" : "R"}esponce set\n\tfor: ${args.message.toLowerCase()}\n\tas:  ${args.responce}`);
                },
                "Sets a new *responce* for a given *message*\nIf *nomod* is set, the responce won't be modified. Use for links."
            ),
            new Commands.CommandTemplate(
                [
                   new Commands.TemplatElementeGenerator.Static("delete"),
                   new Commands.TemplatElementeGenerator.Any("message")
                ],
                function (args, message) {
                    Responces.delete(args.message);
                    Kernel.responce.simple(message, `Deleted responce for ${args.message}`);
                },
                "Deletes a preset responce for given *message*"
            )
        ],
        "Sets or deletes preset responces"
    )
]