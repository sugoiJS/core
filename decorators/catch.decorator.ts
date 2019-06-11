import {SugoiError} from "../exceptions/sugoi-abstract.exception";
import {applyClassLevelDecorator} from "../utils/function.utils";

const CATCH_KEY = "__SUG_CATCH_KEY";
export type TError = typeof Error | typeof SugoiError;

export function Catch();
export function Catch(handler: (err: Error | SugoiError) => any);
export function Catch(...errors: Array<TError | string>);
export function Catch(handler: (err: Error | SugoiError) => any, ...errors: Array<TError | string>);

export function Catch(errorOrHandler: TError | string | ((err: Error | SugoiError) => any) = (err) => null, ...errors: Array<TError | string>) {
    let handler;
    if (typeof errorOrHandler === "function"
        && !(errorOrHandler instanceof Error || errorOrHandler instanceof SugoiError)) {
        handler = errorOrHandler;
    } else {
        errors.push.apply(errors, errorOrHandler);
    }
    return function (target: any, name?: string, descriptor?: PropertyDescriptor) {
        if (!name) {
            applyClassLevelDecorator(target, () => Catch(handler, ...errors));
        } else {
            setCatcherCallback(target, name, descriptor, handler, errors);
        }
    }
}

// function setClassLevel(target, handler, errors) {
//     const props = Object.getOwnPropertyNames(target);
//     props.forEach(functionName => {
//         if (functionName === "constructor" || functionName === "prototype") return;
//         const descriptor = Object.getOwnPropertyDescriptor(target, functionName);
//         if (descriptor && typeof descriptor.value === 'function') {
//             setCatcherCallback(target, functionName, descriptor, handler, errors);
//         }
//     });
//     if (target.prototype) {
//         setClassLevel(target.prototype, handler, errors);
//     }
//
// }


function setCatcherCallback(target, name, descriptor, handler, errors) {
    const next = descriptor.value;
    const that = this;
    descriptor.value = catcherCallback(errors, handler, next);
    Object.defineProperty(target, name, descriptor);
}


export function catcherCallback(errors, handler, next) {
    return function (...args) {
        try {
            return next.apply(this, args);
        } catch (e) {
            const eName = e.constructor.name;
            let found = 0;
            if (Array.isArray(errors) && errors.length > 0) {
                found = errors.findIndex((error) => {
                    if (typeof error === "string") {
                        return eName === error;
                    } else {
                        return eName === error.name;
                    }
                });
            }
            if (found > -1) {
                return handler.apply(this, [e]);
            } else {
                throw e;
            }
        }
    }
}