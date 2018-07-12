import {IExceptionConstant} from "../interfaces/exception-constant.interface";

export const Exceptions: { [prop: string]: IExceptionConstant } = {
    INVALID: {code: 4000, message: "INVALID"},
    NOT_IMPLEMENTED: {code: 4001, message: "NOT_IMPLEMENTED"}
};