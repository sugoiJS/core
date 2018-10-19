import { ComparableValueType, IComparableValue } from "../interfaces/comparable-value.interface";
export declare class ComparableSchema implements IComparableValue {
    valueType: ComparableValueType;
    mandatory?: boolean;
    regex?: string;
    regexFlag?: string;
    min?: number;
    max?: number;
    exclusiveMin?: number;
    exclusiveMax?: number;
    arrayAllowed?: boolean;
    protected constructor(valueType: ComparableValueType);
    static ofType(valueType: ComparableValueType): ComparableSchema;
    setMandatory(isMandatory: boolean): this;
    setRegex(regexString: string, regexFlag?: string): this;
    setMin(min: number): this;
    setExclusiveMin(min: number): this;
    setMax(max: number): this;
    setExclusiveMax(max: number): this;
    setArrayAllowed(isAllowed: boolean): this;
}
