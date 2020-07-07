
module.exports = {
    description: "Check if the bot is running!",

    execute: async function (ctx) {
        await ctx.reply(`Hi! I've been running for ${Math.floor(process.uptime())} seconds.`);
    }
}