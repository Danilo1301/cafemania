import { BaseObject } from "../baseObject/baseObject";

interface IEvent {
    eventEmitter: Phaser.Events.EventEmitter
    event: string
    fn: any
}

export class EventRegister extends BaseObject{
    private _context: any;

    private _events: IEvent[] = []
    
    constructor(context: any) {
        super();

        this._context = context;
    }

    public addListener(eventEmitter: Phaser.Events.EventEmitter, event: string, fn: any) {
        const ev: IEvent = {
            eventEmitter: eventEmitter,
            event: event,
            fn: fn
        }

        this._events.push(ev);

        eventEmitter.on(event, fn, this._context);
    }

    public removeAllListeners() {
        for (const ev of this._events) {
            ev.eventEmitter.off(ev.event, ev.fn, this._context);
        }
        this._events = [];
    }
}