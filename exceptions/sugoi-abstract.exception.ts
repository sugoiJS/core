export abstract class SugoiError extends Error {
    public code: number;
    private data: any[] = [];

    constructor(message: string, code: number, data: any = []) {
        super(message);
        this.code = code;
        if (!Array.isArray(data)){
            data = [data]
        }
        this.data.push.apply(this.data, data);
        console.error(`Error: ${this.code} - ${this.message} - ${this.data}`);
        this.stack = new Error().stack;

    }
}