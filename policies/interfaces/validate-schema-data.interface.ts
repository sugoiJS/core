import {TComparableValue} from "./compareable-value.interface";

export type TValidateSchemaMeta = {index:number,schema:{[prop:string]:TComparableValue},key?:string};
export type TValidateSchemaData = {functionArgs?: any[], policyMeta?: TValidateSchemaMeta[]}