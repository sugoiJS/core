import {Injectable,SchemaTypes,ComparableSchema,ValidateSchemaPolicy} from "../../index";
import {Deprecated} from "../../decorators/deprecated.decorator";

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
    id:ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true),
    active:ComparableSchema.ofType(SchemaTypes.BOOLEAN).setMandatory(true)
};

@Injectable()
export class PolicyCheck {
    public verifyData  = new Date().getTime();
    public entity: IEntity;


    @ValidateSchemaPolicy(null,{schema:EntitySchema})
    setEntity(entity:IEntity) {
        this.entity = entity;
    }
    @Deprecated(false)
    myName(){
        return "Check";
    }
}
