import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {POLICY_META_KEY, POLICY_KEY, sugPolicyDelimiter} from "../decorators/policy.decorator";

export class PolicyItem {
    public static PolicyCounter: number = 1;
    private static policies: Map<string, TPolicy> = new Map();
    public policyValidator: any;

    static add(policy: PolicyItem) {
        PolicyItem.policies.set(policy.name, policy.policyValidator);
    }

    static get(policyName: string): TPolicy {
        return PolicyItem.policies.get(policyName);

    }

    static has(policyName: string): boolean {
        return PolicyItem.policies.has(policyName);
    }

    static remove(policyName: string) {
        PolicyItem.policies.delete(policyName);
    }

    public static setPolicyDescriptor(contextClass: any,
                                      propertyKey: string,
                                      next: (...args) => void,
                                      failedResponseCode: number,
                                      async: boolean = true) {
        return function (...applyArgs) {
            const that = this;
            const policies = Reflect.getMetadata(POLICY_KEY, contextClass, propertyKey) || [];

            if (async) {
                return PolicyItem.applyAsyncPolicy(policies, contextClass, propertyKey, applyArgs, failedResponseCode)
                    .then(() => {
                        return next.apply(that, applyArgs);
                    })
                    .catch((err) => {
                        throw err;
                    })
            } else {
                PolicyItem.applySyncPolicy(policies, contextClass, propertyKey, applyArgs, failedResponseCode);
                return next.apply(that, applyArgs);
            }

        };
    }

    static applyAsyncPolicy(policies: Array<string>,
                            contextClass: any,
                            propertyName: string,
                            applyArgs: Array<any>,
                            failedResponseCode?: number) {
        const promises = [];
        for (let policyId of policies) {
            let policyIdArr = policyId.split(sugPolicyDelimiter);
            const policy = PolicyItem.get(policyIdArr[0]);
            if (!policy) {
                console.info(`${policy} policy not found`);
                return Promise.resolve([true]);
            }
            const policyMeta = Reflect.getMetadata(POLICY_META_KEY,
                contextClass, `${propertyName}_${policyIdArr[0]}_${policyIdArr[1]}`);
            let result = (<Promise<boolean>>policy({functionArgs: applyArgs, policyMeta: policyMeta}));
            if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }
            const promise = result.then((validationResult) => {
                if (validationResult !== true) {
                    throw new SugoiPolicyError(EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || EXCEPTIONS.POLICY_BLOCKED.code, {
                        type: "policy",
                        policyId: policyIdArr[0],
                        validationResult: validationResult
                    })
                }
                return true;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    }


    static applySyncPolicy(policies: Array<string>,
                           contextClass: any,
                           propertyName: string,
                           applyArgs: Array<any>,
                           failedResponseCode?: number) {
        for (let policyId of policies) {
            let policyIdArr = policyId.split(sugPolicyDelimiter);
            const policy = PolicyItem.get(policyIdArr[0]);
            if (!policy) {
                console.info(`${policy} policy not found`);
                return true;
            }
            const policyMeta = Reflect.getMetadata(POLICY_META_KEY,
                contextClass, `${propertyName}_${policyIdArr[0]}_${policyIdArr[1]}`);
            const validationResult = policy({functionArgs: applyArgs, policyMeta: policyMeta});
            if (validationResult != true) {
                throw new SugoiPolicyError(EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || EXCEPTIONS.POLICY_BLOCKED.code, {
                    type: "policy",
                    policyId: policyIdArr[0],
                    validationResult: validationResult
                })
            }

        }
        return true;
    }

    constructor(policyValidator: TPolicy, private name: string = policyValidator.constructor.name) {
        this.setPolicyValidator(policyValidator);
    }

    setPolicyValidator(guardianValidator: TPolicy) {
        this.policyValidator = (arg) => guardianValidator(arg);
    }

}

export type TPolicyResults = true | any;
export type TPolicyPayload = { functionArgs?: any[], policyMeta?: any[] };
export type TPolicy = (policyData?: TPolicyPayload) => (Promise<TPolicyResults> | TPolicyResults);