
module.exports = function MessageContext(bot, args) {
    this.bot = bot;
    this.message = args.content;
    this.platform = args.platform;
    this.location = args.location;

    this.findCommand = async function() {
        if (this.message.startsWith(bot.config.prefix)) {
            this.args = message.content.slice(bot.config.prefix.length).split(" ");
            return this.bot.commands[this.args.shift()];
        }
    }

    this.reply = async function(message) {
        this.bot[this.platform].sendMessage(this.location, message);
    }
    return this;
}