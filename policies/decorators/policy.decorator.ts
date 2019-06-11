import {PolicyItem, TPolicy} from "../classes/policy-item.class";
import {EXCEPTIONS} from "../../constants/exceptions.constant";
import {SugoiPolicyError} from "../exceptions/policy-error.exception";
import {TValidateSchemaData, TValidateSchemaMeta} from "../interfaces/validate-schema-data.interface";
import {ValidateSchemaUtil} from "../utils/validate-schema.util";
import {StringUtils} from "../utils/string.util";

export const POLICY_META_KEY = "POLICY_META";
export const POLICY_KEY = "POLICY";
export const sugPolicyDelimiter = "|_S_|";

/**
 * Register function as policy
 * @param {Policy|string} policyId - optional, if not set {class name}.{function name} will be use
 * @returns {(policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
function Policy();
function Policy(policyId: string)
function Policy(policyId?: string) {
    return function (policyClass: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        if (typeof descriptor.value !== "function") {
            throw new SugoiPolicyError(EXCEPTIONS.INVALID_POLICY.message, EXCEPTIONS.INVALID_POLICY.code, propertyKey);
        }
        policyId = policyId || `${policyClass.name}.${propertyKey}`;
        PolicyItem.add(new PolicyItem(descriptor.value.bind(policyClass), policyId));
    }
};

/**
 * Apply policy on decorated function.
 * The policy got selected by the policyId
 *
 * @param {string|Function} policy
 * @param {number} failedResponseCode
 * @param policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
function UsePolicy(policy: TPolicy | string);
function UsePolicy(policy: TPolicy | string, failedResponseCode: number);
function UsePolicy(policy: TPolicy | string, failedResponseCode: number, ...policyMeta: any[]);
function UsePolicy(policy: TPolicy | string, failedResponseCode: number = 400, ...policyMeta: any[]) {
    return UsePolicyApply(policy, failedResponseCode, true ,...policyMeta);
}

function UsePolicySync(policy: TPolicy | string);
function UsePolicySync(policy: TPolicy | string, failedResponseCode: number);
function UsePolicySync(policy: TPolicy | string, failedResponseCode: number, ...policyMeta: any[]);
function UsePolicySync(policy: TPolicy | string, failedResponseCode: number = 400, ...policyMeta: any[]) {
    return UsePolicyApply(policy, failedResponseCode,false, ...policyMeta);
}

function UsePolicyApply(policy: TPolicy | string, failedResponseCode: number,async:boolean, ...policyMeta: any[]) {
    let policyId;
    const policyMetaObject = {policyMeta, id: StringUtils.generateGuid()};
    if (typeof policy === "function") {
        policyId = policy.name || PolicyItem.PolicyCounter++;
        if (!PolicyItem.has(policyId))
            PolicyItem.add(new PolicyItem(policy, policyId));
    } else {
        policyId = policy;
    }

    return function (contextClass: any,
                     propertyKey?: string,
                     descriptor?: PropertyDescriptor) {
        if (propertyKey && descriptor) {
            applyPolicy(policyId, contextClass, propertyKey, descriptor, policyMetaObject, failedResponseCode,async)
        } else {
            applyPolicyForClassLevel(policyId, contextClass, policyMetaObject, failedResponseCode,async);
        }
    }
}

function applyPolicyForClassLevel(policyId, contextClass, policyMeta, failedResponseCode, async?: boolean) {
    const functions = [];
    functions.push.apply(functions, Object.getOwnPropertyNames(contextClass));
    functions.forEach((functionName) => {
        if (functionName === "constructor" || functionName === "prototype") return;
        const descriptor = Object.getOwnPropertyDescriptor(contextClass, functionName);
        if (descriptor && typeof descriptor.value == 'function') {
            applyPolicy(policyId, contextClass, functionName, descriptor, policyMeta, failedResponseCode);
            Object.defineProperty(contextClass, functionName, descriptor);
        }
    });
    if (contextClass.prototype) {
        applyPolicyForClassLevel(policyId, contextClass.prototype, policyMeta, failedResponseCode, async)
    }

}

function applyPolicy(policyId, contextClass, propertyKey: string, descriptor: PropertyDescriptor, policyMeta, failedResponseCode, async?: boolean) {
    propertyKey = !!propertyKey ? propertyKey : null;

    const contextPolicies = Reflect.getMetadata(POLICY_KEY, contextClass, propertyKey) || [];
    const isOverridden = contextPolicies.length > 0;
    contextPolicies.push(`${policyId}${sugPolicyDelimiter}${policyMeta.id}`);

    Reflect.defineMetadata(POLICY_KEY, contextPolicies, contextClass, propertyKey);
    Reflect.defineMetadata(POLICY_META_KEY, policyMeta.policyMeta, contextClass, `${propertyKey}_${policyId}_${policyMeta.id}`);

    if (!isOverridden) {
        const next = descriptor.value;
        descriptor.value = PolicyItem.setPolicyDescriptor(contextClass, propertyKey, next, failedResponseCode, async);
        Object.defineProperty(contextClass, propertyKey, descriptor)
    }
}

/**
 *  Predefined policy which check the arguments schema
 *
 * @param {number} failedResponseCode
 * @param {TValidateSchemaData} policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
const ValidateSchemaPolicy = function (failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[]) {
    return UsePolicy('ValidateSchemaUtil.ValidateArgs', failedResponseCode, ...policyMeta);
};

const ValidateSchemaPolicySync = function (failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[]) {
    return UsePolicySync('ValidateSchemaUtil.ValidateArgs', failedResponseCode, ...policyMeta);
};


export {Policy, UsePolicy,UsePolicySync, ValidateSchemaPolicy,ValidateSchemaPolicySync}