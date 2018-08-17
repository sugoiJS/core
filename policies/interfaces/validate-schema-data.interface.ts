import {TComparableValue} from "./compareable-value.interface";

export type TValidateSchemaMeta = {argIndex:number,schema:{[prop:string]:TComparableValue},keyInArg?:string};
export type TValidateSchemaData = {functionArgs?: any[], policyMeta?: TValidateSchemaMeta[]}