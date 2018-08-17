export type TComparableValue<T=any> = {
    mandatory?: boolean;
    valueType: T | string;
    regex?: string;
    regexFlag?:boolean;
    min?: number;
    max?: number;
    exclusiveMin?:number;
    exclusiveMax?:number;
    arrayAllowed?:boolean;
};
