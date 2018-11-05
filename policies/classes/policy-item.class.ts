import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {POLICY_META_KEY, POLICY_KEY, sugPolicyDelimiter} from "../decorators/policy.decorator";

export class PolicyItem {
    public policyValidator: any;
    private static policies: Map<string, TPolicy> = new Map();

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
                                      failedResponseCode: number) {
        return function (...applyArgs) {
            const scope = this;
            const policies = Reflect.getMetadata(POLICY_KEY, contextClass, propertyKey) || [];
            const promises = [];
            for (let policyId of policies){
                policyId = policyId.split(sugPolicyDelimiter);
                const policy = PolicyItem.get(policyId[0]);
                if (!policy) {
                    console.info(`${policy} policy not found`);
                    return Promise.resolve();
                }
                const policyMeta = Reflect.getMetadata(POLICY_META_KEY, contextClass, `${propertyKey}_${policyId[0]}_${policyId[1]}`);
                const promise = policy( {functionArgs: applyArgs, policyMeta: policyMeta})
                    .then((validationResult) => {
                        if (validationResult != true) {
                            throw new SugoiPolicyError(EXCEPTIONS.POLICY_BLOCKED.message, failedResponseCode || EXCEPTIONS.POLICY_BLOCKED.code, {type:"policy",policyId:policyId[0], validationResult:validationResult})
                        }
                    });
                promises.push(promise);
            }
            return Promise.all(promises)
                .then(() => {
                    return next.apply(scope,applyArgs);
                })
                .catch((err) => {
                    throw err;
                })
        };
    }

    constructor(policyValidator: TPolicy, private name: string = policyValidator.constructor.name) {
        this.setPolicyValidator(policyValidator);
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

export type TPolicyResults = true | any;
export type TPolicy = (policyData?:{functionArgs?: any[], policyMeta?: any[]})=>(Promise < TPolicyResults > | TPolicyResults);