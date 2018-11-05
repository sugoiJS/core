"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dummy_class_1 = require("./classes/dummy.class");
const entity = { id: true, num: 2, active: 1 };
describe("test decorators general", () => {
    it("test iterable decorator", () => {
        const dummy = Object.assign(new dummy_class_1.Dummy(), entity);
        delete dummy.valid;
        const values = [...dummy];
        expect(values.length).toEqual(3);
        expect(values).toEqual(Object.values(entity));
    });
});
