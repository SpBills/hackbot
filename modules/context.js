
module.exports = function MessageContext(bot, args) {
    this.bot = bot;
    this.message = args.content;
    this.platform = args.platform;
    this.location = args.location;

    this.findCommand = async function() {
        if (this.message.startsWith(bot.config.prefix))
            return this.bot.commands[message.content.substring(bot.config.prefix.length)];
    }

    this.reply = async function(message) {
        console.log(this.platform)
        this.bot[this.platform].sendMessage(this.location, message);
    }
    return this;
}