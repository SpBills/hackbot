const { RTMClient } = require('@slack/rtm-api');
const { WebClient, WebClientEvent } = require('@slack/web-api');

module.exports = function SlackClient(bot) {
    this.bot = bot;
    this.http = new WebClient(bot.config.slack.web_token);
    this.http.on(WebClientEvent.RATE_LIMITED, async (seconds) => await this.bot.on('err', {msg: `Hit Slack Web Rate-limit. Will retry in ${seconds} seconds...`, source: 'slack'}));
    this.client = new RTMClient(bot.config.slack.rtm_token);
    this.client.on('message', async (event) => {
      message = {
        platform: "slack",
        author: event.user,
        content: event.text,
        location: event.channel,
        private: false,
      };
      if (message.author == message.location) message.private = true;
      await bot.on('message', message);
    });
    this.client.on('error', async (error) => await bot.on('error', { msg: error, source: 'slack'}));
    this.client.on('ready', async () => await this.bot.on('info', { msg: "Slack RTM client connected.", source: 'slack' }));
    this.client.start().then();
    this.sendMessage = async (location, message) => await this.http.chat.postMessage({ channel: location, text: message, }),
    this.proxyMessage = function(proxyInfo) {

    }
}