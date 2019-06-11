import {Injectable, SchemaTypes, ComparableSchema, ValidateSchemaPolicy} from "../../index";
import {ValidateSchemaPolicySync} from "../../policies/decorators/policy.decorator";

export interface IEntity {
    metaData?: any,
};

export const EntitySchema = {
    metaData: ComparableSchema.ofType({timestamp: ComparableSchema.ofType(SchemaTypes.NUMBER)})
};

@Injectable()
export class NestedPolicyCheck {

    public entity: IEntity;


    @ValidateSchemaPolicy(null, {schema: EntitySchema})
    setEntity(entity: IEntity) {
        this.entity = entity;
    }

    @ValidateSchemaPolicySync(null, {schema: EntitySchema})
    setEntitySync(entity: IEntity) {
        this.entity = entity;
    }
}
