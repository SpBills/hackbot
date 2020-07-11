import Command from '../types/command';
import LinkSvc from '../types/link';
import Pool from 'pg';

export default class Bot {
    config: Object;

    linkService: LinkSvc;
    db: Pool;
    commands: Record<string, Command>;
    platforms: Array<Boolean>;

    on: Function;
}