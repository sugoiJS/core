import {TComparableValue} from "./compareable-value.interface";

export interface IPolicySchemaValidator<T=any>{
    validate():boolean;
    validateValue: T;
    schema: {[prop:string]:TComparableValue};
}
