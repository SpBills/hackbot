import Bot from "./bot";

export default class LinkSvc {
    bot: Bot;
    getLinkFromLocation: Function;
    getLinkFromId: Function;
    createLink: Function;
    joinLink: Function;
    leaveLink: Function;
    executeLink: Function;
}