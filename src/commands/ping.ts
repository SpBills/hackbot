import Command from "../types/command";
import Context from "../types/context";

export default class PingCommand implements Command {
    name = "ping";
    description = "Check if the bot is running!";
    permitted = (ctx: Context) => true;
    execute = async function (ctx: Context) {
        await ctx.reply(`Hi! I've been running for ${Math.floor(process.uptime())} seconds.`);
    }
}