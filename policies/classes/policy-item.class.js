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
const exceptions_constant_1 = require("../../constants/exceptions.constant");
const policy_error_exception_1 = require("../exceptions/policy-error.exception");
const policy_decorator_1 = require("../decorators/policy.decorator");
class PolicyItem {
    constructor(policyValidator, name = policyValidator.constructor.name) {
        this.name = name;
        this.setPolicyValidator(policyValidator);
    }
    static add(policy) {
        PolicyItem.policies.set(policy.name, policy.policyValidator);
    }
    static get(policyName) {
        return PolicyItem.policies.get(policyName);
    }
    static has(policyName) {
        return PolicyItem.policies.has(policyName);
    }
    static remove(policyName) {
        PolicyItem.policies.delete(policyName);
    }
    static setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode) {
        return function (...applyArgs) {
            return __awaiter(this, void 0, void 0, function* () {
                const scope = this;
                const policies = Reflect.getMetadata(policy_decorator_1.POLICY_KEY, contextClass, propertyKey) || [];
                const promises = [];
                for (let policyId of policies) {
                    policyId = policyId.split(policy_decorator_1.sugPolicyDelimiter);
                    const policy = PolicyItem.get(policyId[0]);
                    if (!policy) {
                        console.info(`${policy} policy not found`);
                        return Promise.resolve();
                    }
                    const policyMeta = Reflect.getMetadata(policy_decorator_1.POLICY_META_KEY, contextClass, `${propertyKey}_${policyId[0]}_${policyId[1]}`);
                    const promise = policy({ functionArgs: applyArgs, policyMeta: policyMeta })
                        .then((validationResult) => {
                        if (validationResult != true) {
                            throw new policy_error_exception_1.SugoiPolicyError(exceptions_constant_1.EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || exceptions_constant_1.EXCEPTIONS.POLICY_BLOCKED.code, { type: "policy", policyId: policyId[0], validationResult: validationResult });
                        }
                    });
                    promises.push(promise);
                }
                return yield Promise.all(promises)
                    .then(() => {
                    return next.apply(scope, applyArgs);
                })
                    .catch((err) => {
                    throw err;
                });
            });
        };
    }
    setPolicyValidator(guardianValidator) {
        this.policyValidator = (arg) => {
            const result = guardianValidator(arg);
            if (result instanceof Promise)
                return result;
            else
                return Promise.resolve(result);
        };
    }
}
PolicyItem.policies = new Map();
exports.PolicyItem = PolicyItem;
