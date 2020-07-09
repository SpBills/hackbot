tg = require("node-telegram-bot-api");

module.exports = function TelegramClient(bot) {
    this.sentReady = false,
    this.client = new tg(bot.config.telegram.token, {polling: true});
    this.client.on('message', async (msg) => {
      message = {
        platform: "telegram",
        author: {
          id: msg.from.id,
          name: msg.from.first_name,
          avatar: null, // TODO: find some way of linking to files without exposing our bot token to everyone. Maybe a small HTTP proxy?
        },
        content: msg.text,
        location: msg.chat.id,
        private: false,
      };
      if (msg.chat.type == "private") message.private = true;
      await bot.on('message', message);
    });
    this.client.on('poll', async (msg) => { if (!this.sentReady) { await bot.on('info', { msg: "Telegram client started polling.", source: 'telegram' }); this.sentReady = true; }});

    this.sendMessage = async (location, message) => await this.client.sendMessage(location, message);
    this.proxyMessage = async (proxyInfo) => await this.client.sendMessage(proxyInfo.location, `[proxy] ${proxyInfo.author.name}: ${proxyInfo.message}`);

    return this;
}