import {SugoiError} from "./sugoi-abstract.exception";

export class SugModelException extends SugoiError {

    constructor(message: string, code: number,data?:any) {
        super(message,code,data);
    }
}