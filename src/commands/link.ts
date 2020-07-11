import Command from "../types/command"
import Context from "../types/context";

export default class LinkCommand implements Command {
    name = "link";
    description = "Link config commands";
    permitted = (ctx: Context) => ctx.bot.config[ctx.platform].owners.includes(ctx.author.id.toString());
    execute = async (ctx: Context) => {
        if (ctx.private) throw { msg: 'Private channels cannot be part of links.', send: true, }
        let cmd = ctx.args.shift();
        let link;
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