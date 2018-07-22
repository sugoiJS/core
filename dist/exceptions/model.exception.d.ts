import { SugoiError } from "./sugoi-abstract.exception";
export declare class ModelException extends SugoiError {
    constructor(message: string, code: number, data?: any);
}
