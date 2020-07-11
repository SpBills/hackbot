import util from 'util';
import Command from '../types/command';
import Context from '../types/context';

export default class DevCommand implements Command {
    name: "dev";
    description = "Developer only commands.";
    permitted = (ctx: Context) => ctx.bot.config[ctx.platform].owners.includes(ctx.author.id.toString());
    execute = async (ctx: Context) => {
        switch (ctx.args.shift()) {
            case "eval": {
                await ctx.reply(util.inspect(await eval(ctx.message.slice(ctx.bot.config.prefix.length + 8).trim())).slice(0,2000));
                break;
            }
            default: {
                await ctx.reply("Incorrect usage");
            }
        };
    };
}