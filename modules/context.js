
module.exports = function MessageContext(bot, args) {
    this.bot = bot;
    this.message = args.content;
    this.author = args.author;
    this.platform = args.platform;
    this.location = args.location;

    this.findCommand = async function() {
        if (this.message.startsWith(bot.config.prefix)) {
            this.args = message.content.slice(bot.config.prefix.length).split(" ");
            return this.bot.commands[this.args.shift()];
        }
    };
    this.reply = async function(message) {
        this.bot.platforms[this.platform].sendMessage(this.location, message);
    };
    this.execute = async function(command) {
        try {
            if (command.permitted(this)) await command.execute(this);
            else throw { msg: "\u{0001f6d1} You are not permitted to run this command.", send: true, }
        } catch (e) {
            if (command.name == "dev") {
                if (e.hasOwnProperty("send")) await this.reply(e.msg);
                else await this.reply(e.toString());
            }
            else if (e.send) await this.reply(e.msg);
            else if (e.send == false) throw e;
            else await this.reply(`There was an error while processing this command. (${e}) Please contact the developer if this persists.`);
        }
    };
    return this;
}