import {EXCEPTIONS, GenericException} from "../index";

export function Deprecated();
export function Deprecated(msg: string);
export function Deprecated(throwException: boolean);
export function Deprecated(msg: string, throwException: boolean);
export function Deprecated(msg: boolean | string = "%s.%s is deprecated", throwException: boolean = false) {
    if (typeof msg === "boolean") {
        throwException = msg;
        msg = "%s.%s is deprecated";
    }
    return function (target: any, name: string) {
        console.info(msg, target.constructor.name, name);
        if (throwException) {
            throw new GenericException(EXCEPTIONS.DEPRECATION_ERROR.message, EXCEPTIONS.DEPRECATION_ERROR.code, [target.constructor.name, name]);
        }
    }
}