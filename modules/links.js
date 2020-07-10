
module.exports = function LinkService(bot) {
    this.bot = bot;
    this.getLinkFromLocation = async (ctx) => {
        q = await this.bot.db.query(`select * from links where ${ctx.platform} = $1`, [ctx.location]);
        if (q.rows) return q.rows.pop();
    };
    this.getLinkFromId = async (id) => {
        q = await this.bot.db.query("select * from links where id = $1", [id]);
        if (q.rows) return q.rows.pop();
    }
    this.createLink = async (ctx) => {
        if (await this.getLinkFromLocation(ctx)) throw { msg: 'This location is already part of a link.', send: true, };
        q = await this.bot.db.query(`insert into links (id, ${ctx.platform}) values (linkuid(), $1) returning *`, [ctx.location]);
        if (q.rows) return q.rows.pop();
    };
    this.joinLink = async function(ctx, id) {
        link = await this.getLinkFromId(id);
        if (link == null) throw { msg: 'The link ID is not valid', send: true, };
        if (link[ctx.location] != null ) throw { msg: 'There is already a channel on this platform joined to this link.', send: true, };
        if (await this.getLinkFromLocation(ctx)) throw { msg: 'This location is already part of a link.', send: true, };
        await this.bot.db.query(`update links set ${ctx.platform} = $1 where id = $2 returning *`, [ctx.location, id]);
        return link;
    };
    this.leaveLink = async function(ctx) {
        link = await this.getLinkFromLocation(ctx);
        if (!link) throw { msg: 'This channel is not currently part of a link.', send: true, };
        q = await this.bot.db.query(`update links set ${ctx.platform} = null where id = $1`, [link.id]);
        if (q.rows) return q.rows.pop();
        return link;
    };
    this.executeLink = async function(ctx) {
        let originalPlatform = ctx.platform;
        link = await this.getLinkFromLocation(ctx);
        if (!link) return;
        for await (key of Object.keys(link)) { 
            if (!(key == "id" || link[key] == null)) {
                let cur = Object.assign({}, ctx);
                cur.location = link[key];
                cur.platform = key;
                if (originalPlatform != cur.platform) await this.bot.platforms[key].executeLink(cur);
            }
        };
    }
    return this;
}