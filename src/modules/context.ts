import Bot from '../types/bot';
import Message from '../types/message';
import Context from '../types/context';

export default class MessageContext extends Context {
    constructor(bot: Bot, msg: Message) {
        super();
        this.bot = bot;
        this.message = msg.content;
        this.author = msg.author;
        this.platform = msg.platform;
        this.location = msg.location;
        this.private = msg.private;

        if (this.message.startsWith(bot.config.prefix)) {
            this.args = this.message.slice(bot.config.prefix.length).split(" ");
            var commandStr = this.args.shift()
            if (commandStr) this.command = this.bot.commands[commandStr];
        }

        this.reply = async function(message) {
            this.bot.platforms[this.platform].sendMessage(this.location, message);
        };
        this.execute = async function() {
            try {
                if (this.command.permitted(this)) await this.command.execute(this);
                else throw { msg: "\u{0001f6d1} You are not permitted to run this command.", send: true, }
            } catch (e) {
                if (this.command.name == "dev") {
                    if (e.hasOwnProperty("send")) await this.reply(e.msg);
                    else await this.reply(e.toString());
                }
                else if (e.send) await this.reply(e.msg);
                else if (e.send == false) throw e;
                else await this.reply(`There was an error while processing this command. (${e}) Please contact the developer if this persists.`);
            }
        };
    }
}