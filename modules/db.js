const pg = require("pg");

const db_init = `

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
}