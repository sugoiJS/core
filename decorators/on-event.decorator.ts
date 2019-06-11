import {EventEmitter as NodeJSEventEmitter} from 'events';
import {GenericException} from "../index";

export class EventEmitter {
    private static readonly _emitters = new Map();

    public channel: string;

    constructor(channel: string = 'DEFAULT') {
        this.setChannelName(channel)
    }

    setChannelName(channel) {
        this.channel = channel;
    }

    getChannelName(): string {
        return this.channel;
    }

    listChannels(): string[] {
        return Array.from(EventEmitter._emitters.keys());
    }

    static setEmitterChannel(channel: string, emitter: NodeJSEventEmitter = new NodeJSEventEmitter()) {
        this._emitters.set(channel, emitter);
    }

    static getEmitterChannel(channel: string): NodeJSEventEmitter {
        return this._emitters.get(channel);
    }

    emit(...args) {
        if(!EventEmitter._emitters.has(this.channel)){
            throw new GenericException(`Event channel ${this.channel} does not exists`, 400,this.channel, true);
        }
        EventEmitter._emitters.get(this.channel).emit(...args);
    }
}

export function OnEvent(event: string, once: boolean = false, channel: string = 'DEFAULT') {
    let emitter = EventEmitter.getEmitterChannel(channel);
    if (!emitter) {
        emitter = new NodeJSEventEmitter();
        EventEmitter.setEmitterChannel(channel, emitter);
    }
    return function (target: any, property: string, descriptor: any) {
        if (once) {
            emitter.once(event, descriptor.value.bind(target));
        } else {
            emitter.on(event, descriptor.value.bind(target));
        }
    }
}