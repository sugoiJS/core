let OnEvent, EventEmitter;
try{
    const eventDecorators = require("./on-event.decorator");
    OnEvent = eventDecorators.OnEvent;
    EventEmitter = eventDecorators.EventEmitter;
}catch(e){}
export {OnEvent, EventEmitter};

export {Catch} from "./catch.decorator";

export {Deprecated} from "./deprecated.decorator";

export {Iterable} from "./iterable.decorator";



