import {SchemaTypes} from "../constants/schema-types.enum";

export type ComparableValueType = SchemaTypes | { [prop: string]: IComparableValue };
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

