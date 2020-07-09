
module.exports = function ProxyService(bot) {
    this.bot = bot;
    this.getLinkFromLocation = async (proxySource) => {
        q = await this.bot.db.query(`select * from links where ${proxySource.platform} = $1`, [proxySource.location]);
        if (q.rows) return q.rows.pop();
    };
    this.getLinkFromId = async (id) => {
        q = await this.bot.db.query("select * from links where id = $1", [id]);
        if (q.rows) return q.rows.pop();
    }
    this.createLink = async (proxySource) => {
        q = await this.bot.db.query(`insert into links (id, ${proxySource.platform}) values (linkuid(), $1) returning *`, [proxySource.location]);
        if (q.rows) return q.rows.pop();
    };
    this.joinLink = async function(proxySource, id) {
        if (!await this.getLinkFromId(id)) throw { msg: 'The link ID is not valid', send: true, };
        if (await this.getLinkFromLocation(proxySource)) throw { msg: 'This location is already part of a link.', send: true, };
        q = await this.bot.db.query(`update links set ${proxySource.platform} = $1 where id = $2 returning *`, [proxySource.location, id]);
        if (q.rows) return q.rows.pop();
    }
    this.proxyMessage = async function(proxySource) {
        link = await this.getLinkFromLocation(proxySource);
        if (!link) return;
        link.keys.forEach(async (key) => { 
            if (!key == "id" && !key == proxySource.platform) {
                cur = proxySource;
                cur.location = link[key];
                await this.bot[key].proxyMessage(cur);
            }
        });
    }
    return this;
}