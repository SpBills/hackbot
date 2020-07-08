const eris = require("eris");

module.exports = function DiscordClient(bot) {
    this.webhook_cache = {};
    this.bot = bot;
    this.client = new eris(this.bot.config.discord.token, {intents: ["guilds", "guildMessages", "directMessages",]});
    this.client.on('ready', () => this.bot.on('info', { msg: "Discord gateway client connected.", source: 'discord' }));
    this.client.on('messageCreate', (msg) => {
        message = {
            platform: "discord",
            content: msg.content,
            location: msg.channel.id,
            private: false,
        };
        if (!msg.guildID) message.private = true;
        this.bot.on('message', message);
    });
    this.client.on('error', (err) => this.bot.on('error', { msg: err, source: 'discord' }));
    this.client.connect().then();
    this.sendMessage = async (location, message) => await this.client.createMessage(location, message),
    this.proxyMessage = async function(proxyInfo) {
        // webhooks!
        webhook = await this.getWebhook(proxyInfo.location);
        console.log(webhook);
        options = {content: proxyInfo.message, username: proxyInfo.author, avatarURL: proxyInfo.avatar, allowedMentions: {everyone: false}};
        await this.client.executeWebhook(webhook.id, webhook.token, options);
    };
    this.getWebhook = async function(channel) {
        webhook = this.webhook_cache[channel];
        if (!webhook) {
            webhook = (await this.client.getChannelWebhooks(channel))[0];
            this.webhook_cache[channel] = { id: webhook.id, token: webhook.token };
        }
        if (!webhook) {
            webhook = await this.client.createChannelWebhook(channel, {name: "hackbot proxy webhook"});
            this.webhook_cache[channel] = { id: webhook.id, token: webhook.token };
        }
        return webhook;
    }
    return this;
}