import {Comparable} from "../classes/comparable.class";

export type TComparableSchema = Comparable | { [prop:string]: Comparable }
export type TValidateSchemaMeta = { argIndex: number, schema: TComparableSchema, keyInArg?: string };
export type TValidateSchemaData = { functionArgs?: any[], policyMeta?: TValidateSchemaMeta[] }