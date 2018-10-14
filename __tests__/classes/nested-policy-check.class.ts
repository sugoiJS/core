import {Injectable, SchemaTypes, ComparableSchema, ValidateSchemaPolicy} from "../../index";

export interface IEntity {
    metaData?: any,
};

const EntitySchema = {
    metaData: ComparableSchema.ofType({timestamp: ComparableSchema.ofType(SchemaTypes.NUMBER)})
};

@Injectable()
export class NestedPolicyCheck {

    public entity: IEntity;


    @ValidateSchemaPolicy(null, {schema: EntitySchema})
    setEntity(entity: IEntity) {
        this.entity = entity;
    }
}
