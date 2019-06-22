import {ComparableSchema} from "..";

export type TComparableSchema = ComparableSchema | { [prop: string]: ComparableSchema } | any;
export type TValidateSchemaMeta = { argIndex?: number, schema: TComparableSchema, keyInArg?: string };
export type TValidateSchemaData = { functionArgs?: any[], policyMeta?: TValidateSchemaMeta[] }

