"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_exception_1 = require("../exceptions/generic.exception");
class myError extends generic_exception_1.GenericException {
}
exports.myError = myError;
describe("exception check", () => {
    it("check exception logic", () => {
        const message = "invalid";
        const code = 600;
        const data = { id: 12 };
        try {
            throw new myError(message, code, data);
        }
        catch (err) {
            expect(err.getMessage()).toBe(message);
            expect(err.getCode()).toBe(code);
            expect(err.getData()[0]).toBe(data);
            expect(err.getStack()).toBeDefined();
        }
    });
});
