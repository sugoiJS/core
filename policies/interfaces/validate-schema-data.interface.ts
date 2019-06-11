
import {ComparableSchema} from "..";
import * as Joi from '@hapi/joi'
import {Ajv} from "ajv";

export type TComparableSchema = ComparableSchema | { [prop:string]: ComparableSchema } | Joi | Ajv;
export type TValidateSchemaMeta = { argIndex?: number, schema: TComparableSchema, keyInArg?: string };
export type TValidateSchemaData = { functionArgs?: any[], policyMeta?: TValidateSchemaMeta[] }