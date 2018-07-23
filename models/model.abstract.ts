import {CONNECTION_STATUS, ModelException, Exceptions} from "../index";


export abstract class ModelAbstract {
    public static status: CONNECTION_STATUS;

    public id: string;

    protected collectionName: string = this.constructor['name'] as string;

    constructor() {

    }

    public static find<T=any>(query: any = {}, options: any = {}): Promise<Array<T>> {
        const that = this;
        query = ModelAbstract.castStringQuery(query);
        return that.findEmitter(query, options)
            .then((res: Array<T>) => {
                res = res.map((collection) => {
                    return that.clone(that, collection);
                });
                return res;
            });

    }


    public static findOne<T=any>(query: any = {}, options: any = {}): Promise<T> {
        options.limit = 1;
        return this.find<T>(query, options)
            .then(res => res ? res[0] : null);
    }

    protected static findEmitter(query: any, options?: any): Promise<any> {
        throw new ModelException(Exceptions.NOT_IMPLEMENTED.message, Exceptions.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };

    public save(options: any | string = {}): Promise<any> {
        this.beforeValidate();
        let valid;
        if ((valid = this.validate()) !== true)
            throw new ModelException(Exceptions.INVALID.message, Exceptions.INVALID.code, valid);
        this.beforeSave();
        return this.saveEmitter(options)
            .then((savedData) => {
                this.afterSave();
                return savedData;
            })
    }

    protected abstract saveEmitter(options): Promise<any>;

    protected beforeValidate() {
        if ('sugBeforeValidate' in (this as any)) {
            (<any>this).sugBeforeValidate();
        }
    }

    public validate(): any | true {
        if ('sugValidate' in (this as any)) {
            const validate = (<any>this).sugValidate();
            return (validate === null || validate === undefined) ? true : validate;
        } else return true;
    };

    protected beforeSave(): void {
        if ("sugBeforeSave" in (this as any)) {
            (<any>this).sugBeforeSave();
        }
    };

    protected afterSave(): void {
        if ('sugAfterSave' in (this as any)) {
            (<any>this).sugAfterSave();
        }
    };

    public update(options: any | string = {}): Promise<any> {
        this.beforeValidate();
        let valid;
        if ((valid = this.validate()) !== true)
            throw new ModelException(Exceptions.INVALID.message, Exceptions.INVALID.code, valid);
        this.beforeUpdate();
        return this.updateEmitter(options)
            .then((updatedData) => {
                this.afterUpdate();
                return updatedData;
            });
    }

    protected abstract updateEmitter(options): Promise<any>;

    public beforeUpdate(): void {
        if ('sugBeforeUpdate' in (this as any))
            (<any>this).sugBeforeUpdate()
    };

    public afterUpdate(): void {
        if ('sugAfterUpdate' in (this as any)) {
            (<any>this).sugAfterUpdate();
        }
    };

    protected abstract removeEmitter(query:any): Promise<any>;

    public remove(query: any): Promise<any> {
        return this.removeEmitter(query);
    }

    public static clone<T>(classIns: any, data: any): T {
        const func = function () {
        };
        func.prototype = classIns.prototype;
        const temp = new func();
        classIns.apply(temp, []);
        temp.constructor = classIns;
        Object.assign(temp, data);
        return temp as T;
    }

    protected static castStringQuery(query: string | any) {
        if (typeof query === "string") {
            query = {id: query};
        }
        return query
    }
}