const Commands  = require("../commands.js");
const Kernel    = require("../kernel.js");
const Responces = require("../responces.js");

module.exports = [
    new Commands.Command("help",
        [
            new Commands.CommandTemplate(
                [],
                function (args, message) {
                    let res = "";
                    for(let key in Commands.Command.prototype.list)
                    {
                        let command = Commands.Command.prototype.list[key];
                        let row = "";

                        row += "**" + command.name + "**";
                        row += " - ";
                        row += command.description;

                        res += row + "\n";
                    }
                    res += "Type \"**help** *command_name*\" for more info";
                    Kernel.responce.simple(message, res);
                },
                "Displays the list of commands"
            ),
            new Commands.CommandTemplate(
                [
                    Commands.TemplatElementeGenerator.Any("command_name")
                ],
                function (args, message) {
                    let res = "";
                    let command = Commands.Command.prototype.list[args.command_name];
                    if(!command){
                        res = "Unknown command";
                    }else{
                        for(let i=0; i<command.templates.length; i++)
                        {
                            let row = "";
                            row += "**" + command.name + " ";
                            row += command.templates[i].toPrototypeString() + '**\n';
                            row += command.templates[i].description;

                            res += row + '\n\n';

                        }
                    }
                    Kernel.responce.simple(message, res);
                },
                "Displays help for a *command*"
            )
        ],
        "Displays help"
    )
]