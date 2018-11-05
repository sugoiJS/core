"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dummy_class_1 = require("./classes/dummy.class");
const policy_check_class_1 = require("./classes/policy-check.class");
const nested_policy_check_class_1 = require("./classes/nested-policy-check.class");
const entity = { id: true, num: 2, active: 1 };
describe("test policy general", () => {
    it("test instance policy", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const dummy = new dummy_class_1.Dummy();
        try {
            yield dummy.verify("FAILED");
        }
        catch (err) {
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
            });
        }
        const msg = "success";
        expect(yield dummy.verify(msg)).toBeTruthy();
        expect(dummy.value).toBe(msg);
    }));
    it("test class policy", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(5);
        const dummy = new dummy_class_1.Dummy();
        const prefix = "test";
        try {
            yield dummy.verifyClassDecorator(prefix, prefix);
        }
        catch (err) {
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
        expect(yield dummy.verifyClassDecorator(prefix, "2")).toBeTruthy();
        expect(dummy.value).toBe(prefix + 2);
        expect(yield dummy.verifyClassDecorator(prefix, 33)).toBeTruthy();
        expect(dummy.value).toBe(prefix + 33);
    }));
    it("test schema validator", () => __awaiter(this, void 0, void 0, function* () {
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
        }, idError = {
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
        }, booleanError = {
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
        }, booleanArrayError = {
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
        const pc = new policy_check_class_1.PolicyCheck();
        expect(pc.myName()).toEqual("Check");
        try {
            yield pc.setEntity(entity);
        }
        catch (err) {
            delete err.stack;
            numberError.data[0].validationResult.invalidValue = entity.num;
            expect(err).toEqual(numberError);
        }
        entity.num = 10;
        try {
            yield pc.setEntity(entity);
        }
        catch (err) {
            numberError.data[0].validationResult.invalidValue = entity.num;
            delete err.stack;
            expect(err).toEqual(numberError);
        }
        entity.num = 3;
        try {
            yield pc.setEntity(entity);
        }
        catch (err) {
            delete err.stack;
            expect(err).toEqual(idError);
        }
        entity.id = "12";
        try {
            yield pc.setEntity(entity);
        }
        catch (err) {
            delete err.stack;
            expect(err).toEqual(booleanError);
        }
        entity.active = [true];
        try {
            yield pc.setEntity(entity);
        }
        catch (err) {
            delete err.stack;
            expect(err).toEqual(booleanArrayError);
        }
        entity.active = true;
        yield pc.setEntity(entity);
        expect(pc.entity).toEqual(entity);
        entity.num = [3, 9];
        yield pc.setEntity(entity);
        expect(pc.entity).toEqual(entity);
    }));
    it("test nested schema validator", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        let en = { metaData: undefined };
        const npc = new nested_policy_check_class_1.NestedPolicyCheck();
        yield npc.setEntity(en);
        expect(npc.entity).toEqual(en);
        en = { metaData: { timestamp: "test" } };
        try {
            yield npc.setEntity(en);
        }
        catch (err) {
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
        en.metaData.timestamp = new Date().getTime();
        yield npc.setEntity(en);
        expect(npc.entity).toEqual(en);
    }));
});
