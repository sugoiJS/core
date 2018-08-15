import {IPolicySchemaValidator} from "../interfaces/policy-schema-validator.interface";
import {TComparableValue} from "../interfaces/compareable-value.interface";

export class PolicySchemaValidator<T=any> implements IPolicySchemaValidator {
    constructor(public validateValue: T,
                public schema: {[prop:string]:TComparableValue<T>}) {
    }

    public validate(): boolean {
        return this.check(this.validateValue, this.schema);
    }

    private check(validateItem: any, schemaItem: any) {
        let valid = true;
        for (let key in validateItem) {
            if (!(validateItem[key] && schemaItem[key] && schemaItem[key].mandatory)) {
                valid = false;
                break;
            }
            else if ((Array.isArray(schemaItem[key])) || (schemaItem[key] && typeof schemaItem[key] === "object")) {
                valid = this.check(validateItem[key],schemaItem[key])
            }
            else{
                this.checkValue(this.validateValue[key],schemaItem[key]);
            }
            if(!valid){break}
        }
        return valid;
    }

    private checkValue(value:any, schema:TComparableValue){
        let val,valid = true;
        switch(schema.valueType as string){
            case "number":
                val = parseInt(value);
                if(val.toString()=== NaN.toString()){
                    valid = false;
                }
                break;
            case "string":
                if(typeof val !== "string"){
                    valid = false;
                }
                break;
            case "boolean":
                if(typeof val !== "string"){
                    valid = false;
                }
                break;
        }
        return valid;
    }


}

