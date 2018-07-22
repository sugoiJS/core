export abstract class SugoiError {
    public code: number;
    public message: string;
    public stack: string;

    private data: any[] = [];

    constructor(message: string, code: number, data: any = []) {
        this.message = message;
        this.code = code;
        if (!Array.isArray(data)){
            data = [data]
        }
        this.data.push.apply(this.data, data);
        this.stack = new Error(message).stack;
        this.printError();
    }

    public getMessage(){
        return this.message;
    }

    public getCode(){
        return this.code
    }

    public getStack(){
        return this.stack;
    }

    public printStack(){
        console.error(this.stack);
    }

    public printError(){
        console.error(`Error: ${this.code} - ${this.message} - ${this.data}`);
    }
}