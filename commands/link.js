
module.exports = {
    name: "link",
    description: "Link config commands",
    permitted: (ctx) => ctx.bot.config[ctx.platform].owners.includes(ctx.author.id.toString()),
    execute: async function(ctx) {
        if (ctx.private) throw { msg: 'Private channels cannot be part of links.', send: true, }
        cmd = ctx.args.shift();
        switch(cmd) {
            case "info":
                link = JSON.stringify(await ctx.bot.linkService.getLinkFromLocation(ctx));
                await ctx.reply(link ? link : "This channel is not currently part of a link.");
                break;
            case "create":
                link = ctx.bot.linkService.createLink(ctx);
                await ctx.reply(`Created link with ID ${link.id}. Please use ${ctx.bot.config.prefix}link join to join other channels to this link.`);
                break;
            case "join":
                link = ctx.bot.linkService.joinLink(ctx, ctx.args[0]);
                await ctx.reply(`Joined link with ID ${link.id}.`)
                break;
            case "leave":
                link = ctx.bot.linkService.leaveLink(ctx);
                await ctx.reply()
            default:
                await ctx.reply("Incorrect usage");
        }
    }
}