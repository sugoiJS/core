export abstract class SugoiError {
    public code: number;
    public message: string;
    public stack: string;

    private data: any[] = [];

    constructor(message: string, code: number, data: any = [],verbose:boolean=true) {
        this.message = message;
        this.code = code;
        if (!Array.isArray(data)){
            data = [data]
        }
        this.data.push.apply(this.data, data);
        this.stack = new Error(message).stack;
        if(verbose) {
            this.printError();
        }
    }

    public getData(){
        return [...this.data]
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
        const payloadData = typeof this.data === "object" ? JSON.stringify(this.data) : this.data;
        console.error(`Error: ${this.code} - ${this.message} - ${payloadData}`);
    }
}