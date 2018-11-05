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
const index_1 = require("../index");
const policy_check_class_1 = require("./classes/policy-check.class");
describe("test utils", () => {
    it("Test stringUtils.guid", () => {
        const amount = 1000;
        const ids = [];
        for (let i = 0; i < 1000; i++) {
            ids.push(index_1.StringUtils.generateGuid());
        }
        expect(new Set(ids).size).toEqual(amount);
    });
    it("Test clone without construct", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const pc = index_1.cast(policy_check_class_1.PolicyCheck, { test: 1 });
        expect(pc.myName()).toBe("Check");
        expect(pc['test']).toBe(1);
        expect(pc.verifyData).toBeUndefined();
        try {
            yield pc.setEntity({});
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
                                "mandatory": true,
                                "valueType": "string"
                            },
                            "invalidValue": undefined,
                            "valid": false
                        }
                    }],
                "message": "Call blocked by resource policy"
            });
        }
    }));
    it("Test clone with construct", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const pc = index_1.clone(policy_check_class_1.PolicyCheck, { test: 1 }, true);
        expect(pc.myName()).toBe("Check");
        expect(pc['test']).toBe(1);
        expect(pc.verifyData).toBeDefined();
        try {
            yield pc.setEntity({});
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
                                "mandatory": true,
                                "valueType": "string"
                            },
                            "invalidValue": undefined,
                            "valid": false
                        }
                    }],
                "message": "Call blocked by resource policy"
            });
        }
    }));
});
