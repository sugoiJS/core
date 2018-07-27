import {SugoiError} from "./sugoi-abstract.exception";

export class SugoiModelException extends SugoiError {

    constructor(message: string, code: number,data?:any) {
        super(message,code,data);
    }
}