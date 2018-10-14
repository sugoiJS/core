import {IExceptionConstant} from "../interfaces/exception-constant.interface";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    INVALID: {code: 4000, message: "INVALID"},
    NOT_IMPLEMENTED: {code: 4001, message: "NOT_IMPLEMENTED"},
    POLICY_BLOCKED: {code: 400,message: "Call blocked by resource policy"},
    INVALID_POLICY: {code: 500,message: "Decorate Policy use on property which is not a function"}
};