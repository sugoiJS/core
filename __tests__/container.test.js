"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const policy_check_class_1 = require("./classes/policy-check.class");
beforeAll(() => {
    index_1.ContainerService.initContainer({
        autoBindInjectable: false,
        defaultScope: "Singleton"
    });
});
describe("Container handling test", () => {
    it("testing container interface", () => {
        index_1.ContainerService.register(policy_check_class_1.PolicyCheck);
        const test1 = index_1.ContainerService.inject(policy_check_class_1.PolicyCheck);
        const test2 = index_1.ContainerService.inject(policy_check_class_1.PolicyCheck);
        expect(test1).toEqual(test2);
        index_1.ContainerService.unregister(policy_check_class_1.PolicyCheck);
        try {
            expect(index_1.ContainerService.inject(policy_check_class_1.PolicyCheck)).toThrowError();
        }
        catch (err) { }
    });
});
