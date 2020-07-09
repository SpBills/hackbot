const util = require("util");

module.exports = {
    description: "Developer only commands.",
    permitted: (ctx) => ctx.bot.config[ctx.platform].owners.includes(ctx.author.id),
    name: "dev",
    execute: async (ctx) => {
        switch (ctx.args.shift()) {
            case "eval": {
                await ctx.reply(util.inspect(await eval(ctx.message.slice(ctx.bot.config.prefix.length + 8).trim())).slice(0,2000));
                break;
            }
            default: {
                await ctx.reply("Incorrect usage");
            }
        }
    }
}