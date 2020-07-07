irc = require('irc');

module.exports = {
    init: function(bot) {
        this.bot = bot;
        this.client = new irc.Client(bot.config.irc.url, bot.config.irc.nick, { channels: bot.config.irc.channels, autoConnect: false });
        this.client.addListener('message', async (from, to, message) => await bot.on('message', { msg: message, from: from, to: to }));
        this.client.addListener('error', async (message) => await bot.on('error', { msg: message, source: 'irc' }));
        this.client.addListener('motd', async (motd) => bot.on('info', { msg: "IRC client connected.", source: "IRC" }));
        this.client.connect();
    },
    sendMessage: async (location, message) => await this.client.say(location, message),
    proxyMessage: async (proxyInfo) => await this.client.say(proxyInfo.location, `[proxy] ${proxyInfo.authorName}: ${proxyInfo.message}`),

}