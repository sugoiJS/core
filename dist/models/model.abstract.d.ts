import { CONNECTION_STATUS } from "../index";
import { Observable } from "rxjs/Observable";
export declare abstract class ModelAbstract {
    static status: CONNECTION_STATUS;
    id: string;
    protected collectionName: string;
    constructor();
    static find<T = any>(query?: any, options?: any): Observable<Array<T>>;
    static findOne<T = any>(query?: any, options?: any): Observable<T>;
    protected static findEmitter(query: any, options?: any): Observable<object>;
    save(options?: any | string): Observable<any>;
    protected abstract saveEmitter(options: any): Promise<any>;
    protected beforeValidate(): void;
    validate(): any | true;
    protected beforeSave(): void;
    protected afterSave(): void;
    update(options?: any | string): Observable<any>;
    protected abstract updateEmitter(options: any): Promise<any>;
    beforeUpdate(): void;
    afterUpdate(): void;
    protected abstract removeEmitter(query: any): Promise<any>;
    remove(query: any): Observable<any>;
    static clone<T>(classIns: any, data: any): T;
    protected static castStringQuery(query: string | object): object;
}
