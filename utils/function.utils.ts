import {DecorateProperty} from "../inversify/index";

export function wrapFunction(wrappedFunction, originalFunction) {
    return new Proxy(wrappedFunction, {
        get: (target, property, receiver) => {
            return originalFunction
        }
    })
}

export function applyClassLevelDecorator(target, decorator) {
        const props = Object.getOwnPropertyNames(target);
        props.forEach(functionName => {
            if (functionName === "constructor" || functionName === "prototype") return;
            const descriptor = Object.getOwnPropertyDescriptor(target, functionName);
            if (descriptor && typeof descriptor.value === 'function') {
                DecorateProperty(decorator(),target, functionName);
            }
        });
        if (target.prototype) {
            applyClassLevelDecorator(target.prototype, decorator);
        }

}

