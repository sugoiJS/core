
import {Dummy} from "./classes/dummy.class";
import {Iiterable} from "../index";
const entity = {id: true, num: 2, active: 1};

describe("test decorators general", () => {
    it("test iterable decorator",()=>{
        const dummy = Object.assign(new Dummy(),entity);
        delete dummy.valid;
        const values = [...dummy as any];
        expect(values.length).toEqual(3);
        expect(values).toEqual((<any>Object).values(entity));
    })

});