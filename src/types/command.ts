
export default class Command {
    name: string;
    description: string;
    permitted: Function;
    execute: Function;
}