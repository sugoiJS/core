export function wrapFunction(wrappedFunction, originalFunction) {
    return new Proxy(wrappedFunction, {
        get: (target, property, receiver) => {
            return originalFunction
        }
    })
}

