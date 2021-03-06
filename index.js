const sentry = require('@sentry/node');
const fs = require("fs");
const context = require('./modules/context');

async function Hackbot() {
    this.config = require("./config.json");
    sentry.init({ dsn: this.config.sentryDsn });

    this.db = await (require("./modules/db.js"))(this);
    this.linkService = new (require("./modules/links.js"))(this);

    this.on = async (type, args) => {
        switch(type) {
            case "message":
                ctx = new context(this, args);
                if (ctx.command) await ctx.execute();
                else await this.linkService.executeLink(ctx);
                break;
            default:
                console.log(`${type} from ${args.source}: ${JSON.stringify(args.msg, null, 2)}`); 
                break;
        }
    }

    // load commands
    this.commands = {};
    try {
        fs.readdirSync("./commands").forEach(f => {
            if (this.config.hasOwnProperty(f)) this.commands[f.slice(0, -3)] = require(`./commands/${f}`);
        });
        this.on('info', { msg: "Succesfully loaded commands.", source: 'bot' });
    } catch (e) {
        this.on('error', { msg: `Could not load commands: ${e}`, source: 'bot' });
    };

    // load platforms
    this.platforms = {};
    try {
        fs.readdirSync("./platforms").forEach(name => {
            this.platforms[name.slice(0, -3)] = new (require(`./platforms/${name}`))(this);
        });
        this.on('info', { msg: "Succesfully loaded platforms.", source: 'bot' });
    } catch (e) {
        this.on('error', { msg: `Could not load platforms: ${e}`, source: 'bot' });
    };

}

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot = Hackbot();