"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(classIns, data, applyConstructor = false) {
    let instance;
    if (applyConstructor) {
        instance = new classIns();
    }
    else {
        instance = Object.create(classIns);
        instance.constructor = new classIns().constructor;
        const descriptor = Object.getOwnPropertyDescriptor(instance, 'constructor');
        descriptor.enumerable = false;
        descriptor.writable = false;
        Object.defineProperty(instance, 'constructor', descriptor);
        Object.setPrototypeOf(instance, classIns.prototype);
    }
    Object.assign(instance, data);
    return instance;
}
exports.clone = clone;
