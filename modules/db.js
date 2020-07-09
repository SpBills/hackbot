const pg = require("pg");

const db_init = `

create table if not exists links
(
    id char(7) unique not null primary key,
    discord text unique,
    irc text unique,
    slack text unique,
    telegram text unique
);

create or replace function makeuid() returns char(7) as $$
declare
    new_uid char(7);
    chars char[] := '{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
    i integer := 0;
begin
    new_uid := '';
    for i in 1..7 loop
        new_uid := new_uid || chars[floor(random() * 26 + 1)::int];
    end loop; return new_uid;
end; $$ language plpgsql;

create or replace function linkuid() returns char(7) AS $$
declare
    linkuid char(7);
    done bool;
begin
    done := false;
    while not done loop
        linkuid := makeuid();
        done := not exists(select 1 from links where id = linkuid);
    end loop; 
    return linkuid;
end; $$ language plpgsql;

`

module.exports = async function(bot) {
    this.bot = bot;
    this.pool = new pg.Pool({connectionString: bot.config.databaseUri});
    await this.pool.connect();
    await this.pool.query(db_init);

    this.query = async function(queryString, args) {
        return this.pool.query(queryString, args);
    };
    return this;
}