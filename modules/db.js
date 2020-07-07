const pg = require("pg");

const db_init = `
create table discord_webhooks
(
    channel bigint not null primary key,
    id bigint not null,
    hook varchar(100) not null 
);

create table discord_

`

module.exports = {
    init: async function(bot) {
        this.pool = new pg.Pool({connectionString: bot.config.databaseUri});
        this.pool.connect();
        return this;
    },
    query: async function(queryString, args) {
        return this.pool.query(queryString, args);
    },
    addDiscordWebhook: async function(channel, id, token) {
        return await this.query("insert into discord_webhooks (channel, id, token) values ($1, $2, $3)", [channel, id, token]);
    },
    getDiscordWebhook: async function(channel) {
        return await this.query("select * from discord_webhooks where channel = $1", [channel]);
    }
}