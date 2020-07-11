import Bot from '../types/bot';
import MessageAuthor from '../types/author';
import Command from '../types/command';

export default class Context {
    bot: Bot;
    message: string;
    author: MessageAuthor;
    platform: string;
    location: string;
    private: Boolean;
    args: Array<string>;
    command: Command;
    reply: Function;
    execute: Function;
}