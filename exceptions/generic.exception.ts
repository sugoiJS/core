import {SugoiError} from "./sugoi-abstract.exception";

export class GenericException extends SugoiError {

    constructor(message: string, code: number, data: any = []) {
        super(message,code,data);
    }
}