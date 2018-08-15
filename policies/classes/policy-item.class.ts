import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {POLICY_META_KEY} from "../decorators/policy.decorator";

export class PolicyItem {
    public policyValidator: any;
    private static policies: Map<string, TPolicy> = new Map();

    static add(policy: PolicyItem) {
        PolicyItem.policies.set(policy.name, policy.policyValidator);
    }

    static get(policyName: string): TPolicy {
        return PolicyItem.policies.get(policyName);
    }

    static remove(policyName: string) {
        PolicyItem.policies.delete(policyName);
    }

    public static setPolicyDescriptor(contextClass: any,
                                      propertyKey: string,
                                      next: () => void,
                                      failedResponseCode: number,
                                      ...policyMeta: any[]) {
        return async function (...functionArgs: any[]) {
            const that = this;

            const policies = Reflect.getMetadata(POLICY_META_KEY, contextClass, propertyKey) || [];
            const promises = policies.map(policyName => {
                const policy = PolicyItem.get(policyName);
                if (!policy) {
                    return Promise.resolve();
                }
                return policy( {functionArgs: functionArgs, policyMeta: policyMeta})
                    .then((res) => {
                        if (res != true) {
                            throw new SugoiPolicyError(EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || EXCEPTIONS.POLICY_BLOCKED.code, [policyName, res])
                        }
                    });
            });
            return await Promise.all(promises)
                .then(() => {
                    return next();
                })
                .catch((err) => {
                    return err;
                })
        };
    }

    constructor(guardianValidator: TPolicy, private name: string = guardianValidator.constructor.name) {
        this.setPolicyValidator(guardianValidator);
    }

    setPolicyValidator(guardianValidator: TPolicy) {
        this.policyValidator = (arg) => {
            const result = guardianValidator(arg);
            if (result instanceof Promise)
                return result;
            else
                return Promise.resolve(result);
        }
    }

}

type TPolicyResults = true | any;
export type TPolicy = (policyData:{functionArgs?: any[], policyMeta?: any[]})=>(Promise < TPolicyResults > | TPolicyResults);