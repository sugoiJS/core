import {
    ValidateSchemaPolicy,
    Iterable
} from "../../index"
import * as Ajv from 'ajv';
const ajv = new Ajv();

@Iterable()
@ValidateSchemaPolicy(400, {
    schema: ajv.compile({
        "properties": {
            num2: {
                type: 'number',
                maximum: 100000000000000,
                minimum: 0
            },

        }
    }),
    argIndex:1
})
export class DummyAjv {
    value:any;
    valid = true;
    private static number: number = 1;
    @ValidateSchemaPolicy(400, {
        schema:
            ajv.compile({
                "properties": {
                    str: {
                        type: 'string',
                        pattern: '([a-z])'
                    },

                }
            })
    })
    public verify({str}:{str:string}) {
        this.value = str;
        return this.valid;
    }

    public verifyClassDecorator(str, {text,num2}: {text:any,num2:any}){
        this.value = text + num2;
        return this.valid;
    }

}