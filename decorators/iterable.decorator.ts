import {Iiterable} from "../index";

export function Iterable() {
    return function (targetClassConstructor: any): any {

        return class extends targetClassConstructor{
            * [Symbol.iterator](){
                for (let key in this) {
                    yield this[key];
                }
            }
        }

    }
}

