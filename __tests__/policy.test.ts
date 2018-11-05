import {Dummy} from "./classes/dummy.class";
import {PolicyCheck} from "./classes/policy-check.class";
import {NestedPolicyCheck} from "./classes/nested-policy-check.class";

const entity = {id: true, num: 2, active: 1};

describe("test policy general", () => {
    it("test instance policy", async () => {
        expect.assertions(3);
        const dummy = new Dummy();
        try {
            await dummy.verify("FAILED");
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                    "code": 400,
                    "data": [{
                        "policyId": "ValidateSchemaUtil.ValidateArgs",
                        "type": "policy",
                        "validationResult": {
                            "expectedValue": {
                                "arrayAllowed": false,
                                "mandatory": false,
                                "regex": "([a-z])",
                                "regexFlag": "",
                                "valueType": "string"
                            }, "invalidValue": "FAILED", "valid": false
                        }
                    }],
                    "message": "Call blocked by resource policy"
                }
            );
        }
        const msg = "success";
        expect(await dummy.verify(msg)).toBeTruthy();
        expect(dummy.value).toBe(msg);
    });

    it("test class policy", async () => {
        expect.assertions(5);
        const dummy = new Dummy();
        const prefix = "test";
        try {
            await dummy.verifyClassDecorator(prefix, prefix)
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": false,
                            "mandatory": false,
                            "max": 100000000000000,
                            "min": 0,
                            "valueType": "number"
                        }, "invalidValue": "test", "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        expect(await dummy.verifyClassDecorator(prefix, "2")).toBeTruthy();
        expect(dummy.value).toBe(prefix + 2);
        expect(await dummy.verifyClassDecorator(prefix, 33)).toBeTruthy();
        expect(dummy.value).toBe(prefix + 33);

    });

    it("test schema validator", async () => {
        const numberError = {
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": true,
                            "exclusiveMax": 10,
                            "exclusiveMin": 2,
                            "mandatory": false,
                            "valueType": "number"
                        }, "invalidValue": 2, "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            },
            idError = {
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": false,
                            "mandatory": true,
                            "valueType": "string"
                        }, "invalidValue": true, "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            },
            booleanError = {
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": false,
                            "mandatory": true,
                            "valueType": "boolean"
                        }, "invalidValue": 1, "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            },
            booleanArrayError = {
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": false,
                            "mandatory": true,
                            "valueType": "boolean"
                        }, "invalidValue": [true], "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            };

        expect.assertions(8);
        const pc = new PolicyCheck();
        expect(pc.myName()).toEqual("Check");
        try {
            await pc.setEntity(entity);
        } catch (err) {
            delete err.stack;
            numberError.data[0].validationResult.invalidValue = entity.num;
            expect(err).toEqual(numberError);
        }

        (<any>entity).num = 10;
        try {
            await pc.setEntity(entity);
        } catch (err) {
            numberError.data[0].validationResult.invalidValue = entity.num;
            delete err.stack;
            expect(err).toEqual(numberError);
        }

        (<any>entity).num = 3;
        try {
            await pc.setEntity(entity);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual(idError);
        }
        (<any>entity).id = "12";
        try {
            await pc.setEntity(entity);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual(booleanError);
        }
        (<any>entity).active = [true];
        try {
            await pc.setEntity(entity);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual(booleanArrayError);
        }
        (<any>entity).active = true;
        await pc.setEntity(entity);
        expect(pc.entity).toEqual(entity);
        (<any>entity).num = [3, 9];
        await pc.setEntity(entity);
        expect(pc.entity).toEqual(entity);
    });

    it("test nested schema validator", async () => {
        expect.assertions(3);
        let en = {metaData: undefined};
        const npc = new NestedPolicyCheck();
        await npc.setEntity(en);
        expect(npc.entity).toEqual(en);
        en = {metaData: {timestamp: "test"}};
        try {
            await npc.setEntity(en);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": {
                            "arrayAllowed": false,
                            "mandatory": false,
                            "valueType": "number"
                        }, "invalidValue": "test", "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        (<any>en.metaData.timestamp) = new Date().getTime();
        await npc.setEntity(en);
        expect(npc.entity).toEqual(en);
    });

});