import {
    ComparableSchema,
    SchemaTypes,
    ValidateSchemaPolicy
} from "../../index"

@ValidateSchemaPolicy(400, {
    schema: ComparableSchema.ofType(SchemaTypes.NUMBER),
    argIndex:1
})
export class Dummy {
    value:any;
    valid = true;
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
}