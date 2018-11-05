import { SugoiError } from "./sugoi-abstract.exception";
export declare class GenericException extends SugoiError {
    constructor(message: string, code: number, data?: any);
}
