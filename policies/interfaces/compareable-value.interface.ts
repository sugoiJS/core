export type TComparableValue<T=any> = {
    mandatory?: boolean,
    valueType: T | string,
    regex?: string,
    min?: number,
    max?: number
};
