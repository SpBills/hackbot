tg = require("node-telegram-bot-api");

module.exports = {
    sentReady: false,
    init: function(bot) {
        this.client = new tg(bot.config.telegram.token, {polling: true});
        this.client.on('message', async (msg) => await bot.on('message', { msg: msg, source: 'telegram' }));
        this.client.on('poll', async (msg) => { if (!this.sentReady) { await bot.on('info', { msg: "Telegram client started polling.", source: 'telegram' }); this.sentReady = true; }});
        return this;
    },
    sendMessage: async (location, message) => await this.client.sendMessage(location, message),
    proxyMessage: async (proxyInfo) => await this.client.sendMessage(proxyInfo.location, `[proxy] ${proxyInfo.authorName}: ${proxyInfo.message}`),
}