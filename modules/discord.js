const eris = require("eris");

const clientOptions = {
    intents: [
        "guilds",
        "guildMessages",
        "directMessages", 
    ]
}

module.exports = {
    init: function(bot) {
        this.bot = bot;
        this.client = new eris(this.bot.config.discord.token, clientOptions);
        this.client.on('ready', () => this.bot.on('info', { msg: "Discord gateway client connected.", source: 'discord' }));
        //this.client.on('messageCreate', (msg) => console.log(msg));
        this.client.on('messageCreate', (msg) => this.bot.on('message', { msg: msg, source: 'discord' }));
        this.client.on('error', (err) => this.bot.on('error', { msg: err, source: 'discord' }));
        this.client.connect().then();
        return this;
    },
    sendMessage: async (location, message) => await this.client.sendMessage(location, message),
    proxyMessage: async function(proxyInfo) {
        // webhooks!
        webhook = this.getWebhook(proxyInfo.location);
        options = {content: proxyInfo.content, username: proxyInfo.authorName, avatarURL: proxyInfo.avatar, allowedMentions: {everyone: false}};
        await this.client.executeWebhook(webhook.id, webhook.token, options);
    },
    getWebhook: async function(channel) {
        webhook = this.bot.db.getDiscordWebhook(channel);
        if (!webhook) webhook = (await this.client.getChannelWebhooks(channel))[0];
        if (!webhook) {
            webhook = await this.client.createChannelWebhook(channel, {name: "hackbot proxy webhook"});
            await this.bot.db.saveDiscordWebhook(channel, webhook.id, webhook.token);
        }
        return webhook;
    }
}