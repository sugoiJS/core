import { TPolicy } from "../classes/policy-item.class";
import { TValidateSchemaMeta } from "../interfaces/validate-schema-data.interface";
export declare const POLICY_META_KEY = "POLICY_META";
export declare const POLICY_KEY = "POLICY";
/**
 * Register function as policy
 * @param {string} policyId - optional, if not set {class name}.{function name} will be use
 * @returns {(policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
declare const Policy: (policyId?: string) => (policyClass: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
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
declare const UsePolicy: (policy: string | TPolicy, failedResponseCode?: number, ...policyMeta: any[]) => (contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 *  Predefined policy which check the arguments schema
 *
 * @param {number} failedResponseCode
 * @param {TValidateSchemaData} policyMeta
 * @returns {(contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 * @constructor
 */
declare const ValidateSchemaPolicy: (failedResponseCode?: number, ...policyMeta: TValidateSchemaMeta[]) => (contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export { Policy, UsePolicy, ValidateSchemaPolicy };
