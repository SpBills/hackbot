import Client from 'irc';
import Message from '../types/message';
import MessageAuthor from '../types/author';
import PlatformClient from '../types/platform';

export default class ircClient extends PlatformClient<Client> {
    constructor(bot) {
        super();
        this.bot = bot;
        this.client = new Client(bot.config.irc.url, bot.config.irc.nick, { channels: bot.config.irc.channels, autoConnect: false });
        this.client.addListener('message', async (from: string, to: string, msg: string) =>
            await bot.on('message', new Message(
                "irc",
                new MessageAuthor(
                    from,
                    from,
                    !to.startsWith("#"),
                ),
                msg,
                to,
                false,
        )));
        this.client.addListener('error', async (message) => await bot.on('error', { msg: message, source: 'irc' }));
        this.client.addListener('motd', async (motd) => bot.on('info', { msg: "IRC client connected.", source: "IRC" }));
        
        this.sendMessage = async (location: string, message: string) => await this.client.say(location, message.replace("\n", " "));
        this.executeLink = async (linkInfo) => await this.client.say(linkInfo.location, `[link] ${linkInfo.author.name}: ${linkInfo.message.replace("\n", " ")}`);

        this.client.connect();
    }
}