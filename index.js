require_init = function (name, bot) { return require(name).init(bot); }

function Hackbot() {
    this.config = require("./config.json");
    this.db = require_init("./modules/db.js", this);
    this.context = require("./modules/context.js", this);

    this.discord = require_init("./modules/discord.js", this);
    this.irc = require_init("./modules/irc.js", this);
    this.slack = require_init("./modules/slack.js", this);
    this.telegram = require_init("./modules/telegram.js", this);

    this.commands = {},

    this.init = function() {
        try {
            require("fs").readdirSync("./commands").forEach(file => {
                bot.commands[file.slice(0, -3)] = require(`./commands/${file}`);
            });
            this.on('info', { msg: "Succesfully loaded commands.", source: 'bot' });
        } catch (e) {
            this.on('err', { msg: `Could not load commands: ${e}`, source: 'bot' });
        };
    };

    this.on = async function(type, args) {
        switch(type) {
            case "message": {
                console.log(JSON.stringify(args, null, 2));
                ctx = new this.context(this, args);
                //command = await ctx.findCommand();
                //if (command) await command.execute(ctx);
                break;
            }
            case "error": { console.log(`ERROR from ${args.source}: ${JSON.stringify(args.msg, null, 2)}`); break; }
            case "info": { console.log(`INFO from ${args.source}: ${JSON.stringify(args.msg, null, 2)}`); break; }
        }
    };
}

bot = new Hackbot()
bot.init()