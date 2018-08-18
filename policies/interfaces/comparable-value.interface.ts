import {ComparableTypes} from "../constants/comparable-types.enum";

export type ComparableValueType = ComparableTypes | { [prop: string]: IComparableValue };
export interface IComparableValue {
    valueType:  ComparableValueType;
    mandatory?: boolean;
    regex?: string;
    regexFlag?: string;
    min?: number;
    max?: number;
    exclusiveMin?: number;
    exclusiveMax?: number;
    arrayAllowed?: boolean;
};

