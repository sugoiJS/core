import {Injectable,SchemaTypes,ComparableSchema,ValidateSchemaPolicy} from "../../index";

export interface IEntity{
    id: any,
    num: any,
    active: any
};

const EntitySchema= {
    num:ComparableSchema.ofType(SchemaTypes.NUMBER)
        .setExclusiveMin(2)
        .setExclusiveMax(10)
        .setArrayAllowed(true),
    id:ComparableSchema.ofType(SchemaTypes.STRING),
    active:ComparableSchema.ofType(SchemaTypes.BOOLEAN)
};

@Injectable()
export class PolicyCheck {
    public verifyData  = new Date().getTime();
    public entity: IEntity;


    @ValidateSchemaPolicy(null,{schema:EntitySchema})
    setEntity(entity:IEntity) {
        console.log(entity)
        this.entity = entity;
    }
}
