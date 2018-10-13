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

    @ValidateSchemaPolicy(400, {
        schema: ComparableSchema.ofType(SchemaTypes.STRING)
            .setRegex("[a-z].*")
    })
    public verify(str:string) {
        return true;
    }


    public verifyClassDecorator(num:any,num2:any){
        return true;
    }

}