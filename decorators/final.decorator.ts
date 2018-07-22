const Final = function() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Object.seal(target);
    }
};

export {Final};