function Query(name, args)
{
    this.name = name;
    this.args = args;
}

function Command(name, templates, description = "")
{
    this.name = name;
    this.templates = templates;
    this.description = description;
}

Command.prototype.getMachingHandler = function(argsFromQuery)
{
    for(let i=0; i<this.templates.length; i++)
    {
        let args = this.templates.parseArgs(argsFromQuery);
        if(args !== false)
        {
            return {handler: this.templates[i].handler, args: args};
        }
    }
    return false;
}

Command.prototype.getPrototypeStrings = function()
{
    return this.templates.map(x => this.name + " " + x.toPrototypeString());
}

function CommandTemplate(templateElements = [], handler, description = "")
{
    this.templateElements = templateElements;
    this.handler = handler;
    this.description = description;
}

CommandTemplate.prototype.parseArgs = function(argsFromQuery)
{
    let argIndex = 0;
    let args = {};
    for(let i=0; i<this.templateElements.length; i++)
    {
        if(!this.templateElements[i].parseArg(args, argsFromQuery[argIndex]))
        {
            if(this.templateElements[i].optional)
            {
                continue;
            }
            return false;
        }
        else
        {
            argIndex++;
        }
    }
    if(argIndex === argsFromQuery.length)
    {
        return args;
    }
    return false;
}

CommandTemplate.prototype.toPrototypeString()
{
    return this.templateElements.map(x => x.toPrototypeString()).join(" ");
}

function CommandTemplateElement(type, name, validator = TemplateElementsValidators.anyValidator, options = {}, optional = false)
{
    this.type = type;
    this.name = name;
    this.validator = validator;
    this.options = options;
    this.optional = optional;
}

CommandTemplateElement.prototype.validate = function(value)
{
    if(this.validator instanceof Function)
    {
        return this.validator(this.options, value);
    }
    return false;
}

CommandTemplateElement.prototype.parseArg = function(args, value)
{
    if(this.validate(value))
    {
        if(this.type === "number" || this.type === "integer")
            value = +value;
        args[this.name] = value;
        return true;
    }
    return false;
}

CommandTemplateElement.prototype.toPrototypeString = function()
{
    if(this.type === "static")
    {
        if(this.optional)
        {
            return `[${this.name}]`;
        }
        else
        {
            return this.name;
        }
    }
    if(this.type === "enum")
    {
        let ps = "()";
        if(this.optional)
        {
            ps = "[]";
        }
        return ps[0] + this.options.values.join("|") + ps[1];
    }

    let ps = "<>";
    if(this.optional)
    {
        ps = "[]";
    }
    return ps[0] + this.name + ps[1];
        
}

const integerRegExp = /\-?[0-9]+/;
const floatRegExp   = /\-?[0-9]+(?:\.[0-9]+)?/;

const TemplateElementsValidators = {

    staticValidator: function(options, value){
        if(options === undefined || value === undefined)
            return false;
        return options.value !== undefined && options.value === value;
    },

    enumValidator: function(options, value){
        if(options === undefined || value === undefined)
            return false;
        return options.values instanceof Array && options.values.indexOf(value) !== -1;
    },

    anyValidator: function(options, value){
        if(options === undefined || value === undefined)
            return false;
        return true;
    },

    regExpValidator: function(options, value){
        if(options === undefined || value === undefined)
            return false;
        return options.regExp instanceof RegExp && options.regExp.test(value);
    }
}

const TemplatElementeGenerator = {
    Static: function(name, optional)
    {
        return new CommandTemplateElement(  "static",
                                            name,
                                            TemplateElementsValidators.staticValidator,
                                            {value: name},
                                            optional);
    },
    Enum: function(name, values, optional)
    {
        return new CommandTemplateElement(  "enum",
                                            name,
                                            TemplateElementsValidators.enumValidator,
                                            {values: values},
                                            optional);
    },
    Any: function(name, optional)
    {
        return new CommandTemplateElement(  "any",
                                            name,
                                            TemplateElementsValidators.anyValidator,
                                            {},
                                            optional);
    },

    Integer: function(name, optional)
    {
        return new CommandTemplateElement(  "integer",
                                            name,
                                            TemplateElementsValidators.regExpValidator,
                                            {regExp: integerRegExp},
                                            optional);
    },

    Number: function(name, optional)
    {
        return new CommandTemplateElement(  "number",
                                            name,
                                            TemplateElementsValidators.regExpValidator,
                                            {regExp: floatRegExp},
                                            optional);
    }

}

function loadCommandsFromFile(path)
{
    let commandFile = require(path);
    if(!commandFile)
        return;
    
}

const Export = {

    // Returns a Query object from a string query
    parseQuery: function(query)
    {
        let phrases = [];

        let insideQuote = false;
        let tempPhrase = "";
        for(let i=0; i<=query.length; i++)
        {
            let char = query[i];

            // Check, if a special character
            if(char === "\\")
            {
                // Check, if slash isn't on the end of the query
                if(++i < query.length)
                {
                    tempPhrase += query[i];
                }
                else
                {
                    i--;
                    tempPhrase += char;
                }
            }
            // Check, if quote
            else if(char === "\"")
            {
                insideQuote = !insideQuote;
            }
            // Check, if end of query or end of phrase
            else if(i === query.length || ( char === " " && !insideQuote) )
            {
                phrases.push(tempPhrase);
                tempPhrase = "";
            }
            else
            {
                tempPhrase += char;
            }
        }

        return new Query(phrases.shift(), phrases);
    }



};

module.exports = Export;