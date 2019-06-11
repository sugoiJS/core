import {SchemaTypes} from "..";

export type ComparableValueType = SchemaTypes | { [prop: string]: IComparableValue };
export interface IComparableValue {
    valueType:  Array<ComparableValueType>;
    mandatory?: boolean;
    regex?: string;
    regexFlag?: string;
    min?: number;
    max?: number;
    exclusiveMin?: number;
    exclusiveMax?: number;
    arrayAllowed?: boolean;
    forceArray?: boolean;
};

