/**
 *
 * @param decorateFunctionReturnedValue - The returned value from the decoration method
 * @param target - class to apply the method on
 * @param property - property of the class
 * @constructor
 */
export function DecorateProperty(decorateFunctionReturnedValue: (target: any, property: string, descriptor: any ) => any, target: any, property: string) {
    return decorateFunctionReturnedValue(target, property, Object.getOwnPropertyDescriptor(target, property));
}