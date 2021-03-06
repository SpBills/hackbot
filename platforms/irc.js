irc = require('irc');

module.exports = function ircClient(bot) {
    this.bot = bot;
    this.client = new irc.Client(bot.config.irc.url, bot.config.irc.nick, { channels: bot.config.irc.channels, autoConnect: false });
    this.client.addListener('message', async (from, to, msg) => {
        message = {
            platform: "irc",
            author: {
                id: from,
                name: from,
                avatar: null,
            },
            content: msg,
            location: to,
            private: false,
        };
        if (!to.startsWith("#")) {
            message.private = true;
            message.location = from;
        };
        await bot.on('message', message);
    });
    this.client.addListener('error', async (message) => await bot.on('error', { msg: message, source: 'irc' }));
    this.client.addListener('motd', async (motd) => bot.on('info', { msg: "IRC client connected.", source: "IRC" }));
    
    this.sendMessage = async (location, message) => await this.client.say(location, message.replace("\n", " "));
    this.executeLink = async (linkInfo) => await this.client.say(linkInfo.location, `[link] ${linkInfo.author.name}: ${linkInfo.message.replace("\n", " ")}`);

    this.client.connect();
    return this;
}