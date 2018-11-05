export function Deprecated(msg: string = "%s.%s is deprecated") {
    return function (target: any, name: string) {
        console.info(msg, target.constructor.name, name);
    }
}