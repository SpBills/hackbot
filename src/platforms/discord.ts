import eris from 'eris';
import PlatformClient from '../types/platform';
import Bot from '../types/bot';
import Message from '../types/message';
import MessageAuthor from '../types/author';

export default class Client extends PlatformClient<eris.Client> {
    getWebhook: Function;
    webhookCache: Object;

    constructor(bot: Bot) {
        super();
        this.webhookCache = {};
        this.bot = bot;
        this.client = new eris.Client(this.bot.config.discord.token, {intents: ["guilds", "guildMessages", "directMessages",]});
        this.client.on('ready', () => this.bot.on('info', { msg: "Discord gateway client connected.", source: 'discord' }));
        this.client.on('messageCreate', (msg: eris.Message) => {
            let message = new Message(
                "discord",
                new MessageAuthor(
                    msg.author.id,
                    msg.author.username,
                    `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                ),
                msg.content,
                msg.channel.id,
                false,
            );
            if (!msg.guildID) message.private = true;
            if (!msg.author.bot) this.bot.on('message', message);
        });
        this.client.on('error', (err) => this.bot.on('error', { msg: err, source: 'discord' }));
        this.client.connect().then();
        this.sendMessage = async (location, message) => await this.client.createMessage(location, message),
        this.executeLink = async function(linkInfo) {
            let webhook = await this.getWebhook(linkInfo.location);
            let options = {content: linkInfo.message, username: linkInfo.author.name, avatarURL: linkInfo.author.avatar, allowedMentions: {everyone: false}};
            await this.client.executeWebhook(webhook.id, webhook.token, options);
        };
        this.getWebhook = async function(channel) {
            let webhook = this.webhookCache[channel];
            if (!webhook) {
                webhook = (await this.client.getChannelWebhooks(channel))[0];
                if (webhook) this.webhookCache[channel] = { id: webhook.id, token: webhook.token };
            }
            if (!webhook) {
                webhook = await this.client.createChannelWebhook(channel, {name: "hackbot webhook"});
                this.webhookCache[channel] = { id: webhook.id, token: webhook.token };
            }
            return webhook;
        }
        return this;
    }
}