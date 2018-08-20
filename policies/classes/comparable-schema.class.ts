import {ComparableValueType, IComparableValue} from "../interfaces/comparable-value.interface";

export class ComparableSchema implements IComparableValue {
    public valueType: ComparableValueType;
    public mandatory: boolean = false;
    public regex: string;
    public regexFlag: string;
    public min: number;
    public max: number;
    public exclusiveMin: number;
    public exclusiveMax: number;
    public arrayAllowed: boolean = false;

    protected constructor(valueType: ComparableValueType) {
        this.valueType = valueType;
    }

    public static ofType(valueType: ComparableValueType) {
        return new ComparableSchema(valueType);
    }

    public setMandatory(isMandatory: boolean) {
        this.mandatory = isMandatory;
        return this;
    }

    public setRegex(regexString: string, regexFlag?: string) {
        this.regex = regexString;
        this.regexFlag = regexFlag || "";
        return this;
    }

    public setMin(min: number) {
        this.min = min;
        return this;
    }

    public setExclusiveMin(min: number) {
        this.exclusiveMin = min;
        return this;
    }

    public setExclusiveMax(max: number) {
        this.exclusiveMax = max;
        return this;
    }

    public setArrayAllowed(isAllowed: boolean) {
        this.arrayAllowed = isAllowed;
        return this;
    }


}