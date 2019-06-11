import {Dummy} from "./classes/dummy.class";
import {PolicyCheck} from "./classes/policy-check.class";
import {NestedPolicyCheck} from "./classes/nested-policy-check.class";
import {DummyAjv} from "./classes/dummy-ajv.class";
import {DummyJoi} from "./classes/dummy-joi.class";
import {SchemaTypes, ComparableSchema} from "../policies";

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
                            "expectedValue": ComparableSchema.ofType(SchemaTypes.STRING).setRegex('([a-z])'),
                            "invalidValue": "FAILED",
                            "valid": false
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
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.NUMBER).setMin(0).setMax(100000000000000),
                        "invalidValue": "test", "valid": false
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


    it("test multi types policy", async () => {
        expect.assertions(5);
        const dummy = new Dummy();
        try {
            await dummy.verifyMultiSchemas(false)
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.STRING, SchemaTypes.NUMBER, {val: ComparableSchema.ofType(SchemaTypes.STRING, SchemaTypes.NUMBER)}),
                        "invalidValue": false,
                        "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        expect(await dummy.verifyMultiSchemas({val: "2"})).toBeTruthy();
        expect(dummy.value).toBe(2);
        expect(await dummy.verifyMultiSchemas(1)).toBeTruthy();
        expect(dummy.value).toBe(1);

    });

    it("test array types policy", async () => {
        const dummy = new Dummy();
        try {
            expect(dummy.verifyArraySchema(1)).toThrowError();
        }catch (e) {}
        try {
            expect(dummy.verifyArraySchema([1, "2", 3])).toThrowError();
        }catch (e) {}
        expect(dummy.verifyArraySchema([1,2,3])).toBeTruthy();
        expect(dummy.value).toBe(6);

    });

    it("test schema validator", async () => {
        const numberError = {
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.NUMBER)
                            .setArrayAllowed(true)
                            .setExclusiveMax(10)
                            .setExclusiveMin(2)
                            .setMandatory(false),
                        "invalidValue": 2, "valid": false
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
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true), "invalidValue": true, "valid": false
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
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.BOOLEAN).setMandatory(true), "invalidValue": 1, "valid": false
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
                        "expectedValue": ComparableSchema.ofType(SchemaTypes.BOOLEAN).setMandatory(true), "invalidValue": [true], "valid": false
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
                        "expectedValue": ComparableSchema.ofType({timestamp:ComparableSchema.ofType(SchemaTypes.NUMBER)}),
                        "invalidValue": "test",
                        "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        (<any>en.metaData.timestamp) = new Date().getTime();
        await npc.setEntity(en);
        expect(npc.entity).toEqual(en);
    });

    it("test nested schema validatorSync", async () => {
        expect.assertions(3);
        let en = {metaData: undefined};
        const npc = new NestedPolicyCheck();
        npc.setEntitySync(en);
        expect(npc.entity).toEqual(en);
        en = {metaData: {timestamp: "test"}};
        try {
            npc.setEntitySync(en);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": ComparableSchema.ofType({timestamp:ComparableSchema.ofType(SchemaTypes.NUMBER)}),
                        "invalidValue": "test", "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        (<any>en.metaData.timestamp) = new Date().getTime();
        npc.setEntitySync(en);
        expect(npc.entity).toEqual(en);
    });

});

describe("test policy ajv", () => {
    it("test instance policy", async () => {
        expect.assertions(3);
        const dummy = new DummyAjv();
        try {
            await dummy.verify({str: "FAILED"});
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                    "code": 400,
                    "data": [{
                        "policyId": "ValidateSchemaUtil.ValidateArgs",
                        "type": "policy",
                        "validationResult": {
                            "expectedValue": [
                                {
                                    "dataPath": ".str",
                                    "keyword": "pattern",
                                    "message": "should match pattern \"([a-z])\"",
                                    "params": {
                                        "pattern": "([a-z])",
                                    },
                                    "schemaPath": "#/properties/str/pattern",
                                },
                            ],
                            "invalidValue": {
                                "str": "FAILED",
                            },
                            "valid": false
                        }
                    }],
                    "message": "Call blocked by resource policy"
                }
            );
        }
        const msg = "success";
        expect(await dummy.verify({str: msg})).toBeTruthy();
        expect(dummy.value).toBe(msg);
    });

    it("test class policy", async () => {
        expect.assertions(3);
        const dummy = new DummyAjv();
        const prefix = "test";
        try {
            await dummy.verifyClassDecorator(null, {text: prefix, num2: prefix})
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                "code": 400,
                "data": [{
                    "policyId": "ValidateSchemaUtil.ValidateArgs",
                    "type": "policy",
                    "validationResult": {
                        "expectedValue": [
                            {
                                "dataPath": ".num2",
                                "keyword": "type",
                                "message": "should be number",
                                "params": {
                                    "type": "number",
                                },
                                "schemaPath": "#/properties/num2/type",
                            },
                        ],
                        "invalidValue": {
                            "text": "test",
                            "num2": "test",
                        },
                        "valid": false
                    }
                }],
                "message": "Call blocked by resource policy"
            });
        }
        expect(await dummy.verifyClassDecorator(null, {text: prefix, num2: 33})).toBeTruthy();
        expect(dummy.value).toBe(prefix + 33);

    });

});

describe("test policy joi", () => {
    it("test instance policy", async () => {
        expect.assertions(3);
        const dummy = new DummyJoi();
        try {
            await dummy.verify("FAILED", 0);
        } catch (err) {
            delete err.stack;
            expect(err).toEqual({
                    "code": 400,
                    "data": [{
                        "policyId": "ValidateSchemaUtil.ValidateArgs",
                        "type": "policy",
                        "validationResult": {
                            "expectedValue": [
                                {
                                    "context": {
                                        "key": undefined,
                                        "label": "value",
                                        "name": undefined,
                                        "pattern": /([a-z])/,
                                        "value": "FAILED",
                                    },
                                    "message": "\"value\" with value \"FAILED\" fails to match the required pattern: /([a-z])/",
                                    "path": [],
                                    "type": "string.regex.base",
                                },
                            ],
                            "invalidValue": "FAILED",
                            "valid": false
                        }
                    }],
                    "message": "Call blocked by resource policy"
                }
            );
        }
        const msg = "success";
        expect(await dummy.verify(msg, 0)).toBeTruthy();
        expect(dummy.value).toBe(msg);
    });

    it("test class policy", async () => {
        expect.assertions(5);
        const dummy = new DummyJoi();
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
                        "expectedValue": [
                            {
                                "context": {
                                    "key": undefined,
                                    "label": "value",
                                    "value": "test",
                                },
                                "message": "\"value\" must be a number",
                                "path": [],
                                "type": "number.base",
                            },
                        ],
                        "invalidValue": "test",
                        "valid": false
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
});