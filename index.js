const discord = require("./modules/discord.js");
const irc = require("./modules/irc.js");
const slack = require("./modules/slack.js");
const telegram = require("./modules/telegram.js");

function Hackbot() {
    this.config = require("./config.json");
    this.db = require("./modules/db.js").init(this);
    this.context = require("./modules/context.js");

    this.on = async function(type, args) {
        switch(type) {
            case "message": {
                ctx = new this.context(this, args);
                command = await ctx.findCommand();
                if (command) await command.execute(ctx);
                break;
            }
            case "error": { console.log(`ERROR from ${args.source}: ${JSON.stringify(args.msg, null, 2)}`); break; }
            case "info": { console.log(`INFO from ${args.source}: ${JSON.stringify(args.msg, null, 2)}`); break; }
        }
    };

    this.commands = {};

    try {
        require("fs").readdirSync("./commands").forEach(file => {
            this.commands[file.slice(0, -3)] = require(`./commands/${file}`);
        });
        this.on('info', { msg: "Succesfully loaded commands.", source: 'bot' });
    } catch (e) {
        this.on('error', { msg: `Could not load commands: ${e}`, source: 'bot' });
    };

    this.discord = new discord(this);
    this.irc = new irc(this);
    this.slack = new slack(this);
    this.telegram = new telegram(this);

}

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot = new Hackbot();