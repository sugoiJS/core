import {SugoiError} from "../exceptions/sugoi-abstract.exception";
import {GenericException} from "../exceptions/generic.exception";

export class myError extends GenericException{}

describe("exception check",()=>{
    it("check exception logic",()=>{
        const message = "invalid";
        const code = 600;
        const data = {id:12};
        try {
            throw new myError(message,code,data);
        }catch (err){
            expect(err.getMessage()).toBe(message);
            expect(err.getCode()).toBe(code);
            expect(err.getData()[0]).toBe(data);
            expect(err.getStack()).toBeDefined();
        }
    })
})