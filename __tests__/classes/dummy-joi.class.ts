import {
    ValidateSchemaPolicy,
    Iterable
} from "../../index"
import * as Joi from '@hapi/joi';

@Iterable()
@ValidateSchemaPolicy(400, {
    schema: Joi.number().min(0).max(100000000000000),
    argIndex:1
})
export class DummyJoi {
    value:any;
    valid = true;
    private static number: number = 1;
    @ValidateSchemaPolicy(400, {
        schema: Joi.string().regex(new RegExp('([a-z])'))
    })
    public verify(str:string,num: number) {
        this.value = str;
        return this.valid;
    }

    public verifyClassDecorator(num:any,num2:any){
        this.value = num + num2;
        return this.valid;
    }

}