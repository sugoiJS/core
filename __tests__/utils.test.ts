import {cast, clone, ComparableSchema, SchemaTypes, StringUtils, setConfiguration, getConfiguration} from "../index";
import {PolicyCheck} from "./classes/policy-check.class";

describe("test utils", () => {

    it("Test stringUtils.guid", () => {
        const amount = 1000;
        const ids = [];
        for (let i = 0; i < 1000; i++) {
            ids.push(StringUtils.generateGuid())
        }
        expect(new Set(ids).size).toEqual(amount);
    });

    it("Test clone without construct", async () => {
        expect.assertions(4);
        const pc = cast<PolicyCheck>(PolicyCheck, {test: 1});
        expect(pc.myName()).toBe("Check");
        expect(pc['test']).toBe(1);
        expect(pc.verifyData).toBeUndefined();
        try {
            await pc.setEntity({} as any)
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.STRING).setArrayAllowed(false).setMandatory(true),
                        "invalidValue": undefined,
                        "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            })
        }
    });

    it("Test clone with construct", async () => {
        expect.assertions(4);
        const pc = clone<PolicyCheck>(PolicyCheck, {test: 1},true);
        expect(pc.myName()).toBe("Check");
        expect(pc['test']).toBe(1);
        expect(pc.verifyData).toBeDefined();
        try {
            await pc.setEntity({} as any)
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true),
                        "invalidValue": undefined,
                        "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            })
        }
    });

    it('Test configuration',()=>{
        const name = 'OBONE';
        setConfiguration({test: {myName: name}})
        expect(getConfiguration<{myName: string}>('test').myName).toEqual(name);
        expect(getConfiguration().test).toBeTruthy();
    })


});