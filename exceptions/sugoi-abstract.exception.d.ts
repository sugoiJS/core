export declare abstract class SugoiError {
    code: number;
    message: string;
    stack: string;
    private data;
    constructor(message: string, code: number, data?: any);
    getMessage(): string;
    getCode(): number;
    getStack(): string;
    printStack(): void;
    printError(): void;
}
