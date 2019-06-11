import {Dummy} from "./classes/dummy.class";
import {Catch, DecorateProperty, EventEmitter, Iiterable} from "../index";
import {DecoratorCatch} from "./classes/decorator-catch.class";
import {PlainClass} from "./classes/plain.class";
const emitter = new EventEmitter();

const entity = {id: true, num: 2, active: 1};

describe("test decorators general", () => {
    it("test iterable decorator", () => {
        const dummy = Object.assign(new Dummy(), entity);
        delete dummy.valid;
        const values = [...dummy as any];
        expect(values.length).toEqual(3);
        expect(values).toEqual((<any>Object).values(entity));
    });

    it("test catch decorator", () => {
        const _dcIns = new DecoratorCatch();
        expect(_dcIns.catchCheck(11)).toEqual(0);
        expect(_dcIns.catchCheck(0)).toEqual(-1);
        expect(_dcIns.catchCheck(1)).toEqual(-1);
        try {
            expect(_dcIns.catchCheck(2)).toThrowError("test generic error");
        } catch (e) {
        }
    });

    it("test class catch decorator", () => {
        expect(DecoratorCatch.classCatchCheck(11)).toEqual(1);
        expect(DecoratorCatch.classCatchCheck(0)).toEqual(null);
        expect(DecoratorCatch.classCatchCheck(1)).toEqual(null);
        try {
            expect(DecoratorCatch.classCatchCheck(null)).toThrowError('test');
        } catch (e) {
        }
    });

    it("test fallback catch decorator", () => {
        expect(DecoratorCatch.catchCheckFallback(11)).toEqual(1);
        expect(DecoratorCatch.catchCheckFallback(0)).toEqual(null);
        expect(DecoratorCatch.catchCheckFallback(1)).toEqual(null);
        expect(DecoratorCatch.catchCheckFallback(null)).toEqual(false);
    });

    it("test property decorate", () => {
        try {
            expect(PlainClass.throwError("test")).toThrowError("test")
        }catch (e) {}

        DecorateProperty(Catch(()=>{
            return 1
        }), PlainClass,'throwError');
        expect(PlainClass.throwError('test 2')).toEqual(1);
    });

});

describe("decorator on event", () => {
    beforeAll(()=>{

    });

    beforeEach(()=>{
        PlainClass.counter = 0;
    });

    it("emit", () => {
        emitter.emit('increment',2);
        expect(PlainClass.counter).toEqual(2);
        emitter.emit('increment',2);
        expect(PlainClass.counter).toEqual(4);
    });


    it("emit once", () => {
        emitter.emit('incrementOnce',2);
        expect(PlainClass.counter).toEqual(2);
        emitter.emit('incrementOnce',2);
        expect(PlainClass.counter).toEqual(2);
    });


    it("emit channel", () => {
        const emitter2 = new EventEmitter('SECOND_CHANNEL');
        emitter.emit('incrementChannel',2);
        expect(PlainClass.counter).toEqual(0);
        emitter2.emit('incrementChannel',2);
        expect(PlainClass.counter).toEqual(2);
    });

});