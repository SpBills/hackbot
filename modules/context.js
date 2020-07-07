
module.exports = function MessageContext(bot, args) {
    this.bot = bot;
    this.message = args.msg;
    this.source = args.source;

    this.findCommand = async function() {
        if (this.message.startsWith(bot.config.prefix))
            return this.bot.commands[message.content.substring(bot.config.prefix.length())];
    }

    this.reply = async function(message) {
        console.log(`replying to message: ${message}`)
    }
    return this;
}