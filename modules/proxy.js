
module.exports = function ProxyService(bot) {
    this.bot = bot;
    this.getLinkFromLocation = async (proxySource) => await this.bot.db.query(`select * from links where ${proxySource.platform} = $1`, [proxySource.location]).rows[0];
    this.getLinkFromId = async (id) => await this.bot.db.query("select * from links where id = $1", [id]);
    this.createLink = async (proxySource) => await this.bot.db.query(`insert into links (id, ${proxySource.platform}) values (linkuid(), $1) returning *`, [proxySource.location]).rows[0];

    this.joinLink = async function(proxySource, id) {
        if (!await this.getLinkFromId(id)) throw { msg: 'The link ID is not valid', send: true, };
        if (await this.getLinkFromLocation(proxySource)) throw { msg: 'This link is already joined to a different location on this platform.', send: true, };
        query = await this.bot.db.query(`update links set ${proxySource.platform} = $1 where id = $2 returning *`, [proxySource.location, id]);
    }
}