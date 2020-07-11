import MessageAuthor from './author';

export default class Message {
    platform: string;
    author: MessageAuthor;
    content: string;
    location: string;
    private: Boolean;

    constructor(platform, author, content, location, p){
        this.platform = platform;
        this.author = author;
        this.content = content;
        this.location = location;
        this.private = p;
    }
}