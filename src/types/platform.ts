import Bot from './bot';

export default class PlatformClient<T> {
    bot: Bot;
    client: T;
    sendMessage: Function;
    executeLink: Function;
}