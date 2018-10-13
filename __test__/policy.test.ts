import {Dummy} from "./classes/dummy.class";
import {SugoiPolicyError} from "../policies/exceptions/policy-error.exception";

describe("test policy general",()=>{
    it("test instance policy",()=>{
        const dummy = new Dummy();
        expect(dummy.verify("FAILED")).toThrowError(SugoiPolicyError);
        expect(dummy.verify("success")).toBeTruthy();
    })

    it("test class policy",()=>{
        const dummy = new Dummy();
        expect(dummy.verifyClassDecorator("test","test")).toThrowError(SugoiPolicyError);
        expect(dummy.verifyClassDecorator("test","2")).toBeTruthy();
        expect(dummy.verifyClassDecorator("test",2)).toBeTruthy();

    })
});