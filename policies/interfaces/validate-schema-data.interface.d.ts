import { ComparableSchema } from "../classes/comparable-schema.class";
export declare type TComparableSchema = ComparableSchema | {
    [prop: string]: ComparableSchema;
};
export declare type TValidateSchemaMeta = {
    argIndex?: number;
    schema: TComparableSchema;
    keyInArg?: string;
};
export declare type TValidateSchemaData = {
    functionArgs?: any[];
    policyMeta?: TValidateSchemaMeta[];
};
