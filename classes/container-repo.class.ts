
export class ContainerRepo{
    public symbol:symbol;
    public dep:any;
    constructor(dep:object,bindName:string = dep.constructor.name){
        this.symbol = Symbol(bindName);
        this.dep = dep;
    }

    public static builder(dep:object,bindName?:string){
        return new ContainerRepo(dep,bindName);
    }
}