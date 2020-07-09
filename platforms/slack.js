const { RTMClient } = require('@slack/rtm-api');
const { WebClient, WebClientEvent } = require('@slack/web-api');

module.exports = function SlackClient(bot) {
    this.bot = bot;
    this.http = new WebClient(bot.config.slack.web_token);
    this.http.on(WebClientEvent.RATE_LIMITED, async (seconds) => await this.bot.on('error', {msg: `Hit Slack Web Rate-limit. Will retry in ${seconds} seconds...`, source: 'slack'}));
    this.client = new RTMClient(bot.config.slack.rtm_token);
    this.client.on('message', async (event) => {
      if (event.subtype == "bot_message") return;
      try {
        author_info = await this.http.users.info({ user: event.user });
      } catch(e) {
        console.log(JSON.stringify(event) + e);
      }
      message = {
        platform: "slack",
        author: {
          id: event.user,
          name: author_info.user.name,
          avatar: author_info.user.profile.image_original,
        },
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
    this.proxyMessage = async function(proxyInfo) {
      await this.http.chat.postMessage({
        channel: proxyInfo.location,
        text: proxyInfo.message,
        as_user: false,
        username: proxyInfo.author,
        icon_url: proxyInfo.avatar,
      });
    }
    return this;
}