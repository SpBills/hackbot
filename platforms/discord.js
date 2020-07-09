const eris = require("eris");

module.exports = function DiscordClient(bot) {
    this.webhookCache = {};
    this.bot = bot;
    this.client = new eris(this.bot.config.discord.token, {intents: ["guilds", "guildMessages", "directMessages",]});
    this.client.on('ready', () => this.bot.on('info', { msg: "Discord gateway client connected.", source: 'discord' }));
    this.client.on('messageCreate', (msg) => {
        message = {
            platform: "discord",
            author: {
                id: msg.author.id,
                name: msg.author.username,
                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
            },
            content: msg.content,
            location: msg.channel.id,
            private: false,
        };
        if (!msg.guildID) message.private = true;
        if (!msg.author.bot) this.bot.on('message', message);
    });
    this.client.on('error', (err) => this.bot.on('error', { msg: err, source: 'discord' }));
    this.client.connect().then();
    this.sendMessage = async (location, message) => await this.client.createMessage(location, message),
    this.proxyMessage = async function(proxyInfo) {
        webhook = await this.getWebhook(proxyInfo.location);
        options = {content: proxyInfo.message, username: proxyInfo.author.name, avatarURL: proxyInfo.author.avatar, allowedMentions: {everyone: false}};
        await this.client.executeWebhook(webhook.id, webhook.token, options);
    };
    this.getWebhook = async function(channel) {
        webhook = this.webhookCache[channel];
        if (!webhook) {
            webhook = (await this.client.getChannelWebhooks(channel))[0];
            if (webhook) this.webhookCache[channel] = { id: webhook.id, token: webhook.token };
        }
        if (!webhook) {
            webhook = await this.client.createChannelWebhook(channel, {name: "hackbot proxy webhook"});
            this.webhookCache[channel] = { id: webhook.id, token: webhook.token };
        }
        return webhook;
    }
    return this;
}