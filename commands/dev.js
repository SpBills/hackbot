const util = require("util");

module.exports = {
    description: "Developer only commands.",
    permitted: (ctx) => ctx.bot.config[ctx.platform].owners[ctx.author],
    execute: async (ctx) => {
        switch (ctx.args.shift()) {
            case "eval": {
                // yes i copypasted this (source: Tupperbox)
                let out;
                try {
                    out = await eval(ctx.message.slice(ctx.bot.config.prefix.length + 8).trim());
                } catch(e) {
                    out = e.toString();
                }
                await ctx.reply(util.inspect(out).slice(0,2000));
                break;
            }
            default: {
                await ctx.reply("Incorrect usage");
            }
        }
    }
}