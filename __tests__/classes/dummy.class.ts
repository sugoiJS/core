import {SchemaTypes, ComparableSchema, Iterable, ValidateSchemaPolicy, ValidateSchemaPolicySync} from "../../index"

@Iterable()
@ValidateSchemaPolicy(400, {
    schema: ComparableSchema.ofType(SchemaTypes.NUMBER).setMin(0).setMax(100000000000000),
    argIndex:1
})
export class Dummy {
    value:any;
    valid = true;
    private static number: number = 1;
    @ValidateSchemaPolicy(400, {
        schema: ComparableSchema.ofType(SchemaTypes.STRING)
            .setRegex("([a-z])")
    })
    public verify(str:string) {
        this.value = str;
        return this.valid;
    }

    public verifyClassDecorator(num:any,num2:any){
        this.value = num + num2;
        return this.valid;
    }

    @ValidateSchemaPolicy(400, {
        argIndex:0,
        schema: ComparableSchema.ofType(SchemaTypes.STRING,SchemaTypes.NUMBER, {val: ComparableSchema.ofType(SchemaTypes.STRING, SchemaTypes.NUMBER)})
    })
    public verifyMultiSchemas(val){
        this.value = parseInt(typeof val === 'object' ? val.val: val);
        return this.valid;
    }

    @ValidateSchemaPolicySync(400, {
        argIndex:0,
        schema: ComparableSchema.ofType(SchemaTypes.NUMBER).setForceArray(true)
    })
    public verifyArraySchema(numbers){
        this.value = 0;
        numbers.forEach(number => this.value += number);
        return this.valid;
    }

}