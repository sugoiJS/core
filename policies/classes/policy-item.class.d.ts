export declare class PolicyItem {
    private name;
    policyValidator: any;
    private static policies;
    static add(policy: PolicyItem): void;
    static get(policyName: string): TPolicy;
    static has(policyName: string): boolean;
    static remove(policyName: string): void;
    static setPolicyDescriptor(contextClass: any, propertyKey: string, next: (...args: any[]) => void, failedResponseCode: number): (...applyArgs: any[]) => Promise<any>;
    constructor(policyValidator: TPolicy, name?: string);
    setPolicyValidator(guardianValidator: TPolicy): void;
}
export declare type TPolicyResults = true | any;
export declare type TPolicy = (policyData?: {
    functionArgs?: any[];
    policyMeta?: any[];
}) => (Promise<TPolicyResults> | TPolicyResults);
