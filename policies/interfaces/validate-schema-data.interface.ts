
import {ComparableSchema} from "../classes/comparable-schema.class";

export type TComparableSchema = ComparableSchema | { [prop:string]: ComparableSchema }
export type TValidateSchemaMeta = { argIndex?: number, schema: TComparableSchema, keyInArg?: string };
export type TValidateSchemaData = { functionArgs?: any[], policyMeta?: TValidateSchemaMeta[] }