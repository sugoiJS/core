import {SugoiError} from "./sugoi-abstract.exception";

export class ModelException extends SugoiError {
    public code: number;

    constructor(message: string, code: number,data?:any) {
        super(message,code,data);

    }
}