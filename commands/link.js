
module.exports = {
    name: "link",
    description: "Link config commands",
    permitted: (ctx) => ctx.bot.config[ctx.platform].owners.includes(ctx.author.id.toString()),
    execute: async function(ctx) {
        cmd = ctx.args.shift();
        switch(cmd) {
            case "info":
                link = JSON.stringify(await ctx.bot.proxyService.getLinkFromLocation(ctx));
                await ctx.reply(link ? link : "No known links.");
                break;
            case "create":
                link = ctx.bot.proxyService.createLink(ctx);
                await ctx.reply(`Created link with ID ${link.id}. Please use ${ctx.bot.config.prefix}link join to join other channels to this link.`);
                break;
            case "join":
                link = ctx.bot.proxyService.joinLink(ctx, ctx.args[0]);
                await ctx.reply(`Joined link with ID ${link.id}.`)
                break;
            default:
                await ctx.reply("Incorrect usage");
        }
    }
}