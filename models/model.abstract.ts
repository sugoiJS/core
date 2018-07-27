import {CONNECTION_STATUS, SugoiModelException, Exceptions} from "../index";


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
        throw new SugoiModelException(Exceptions.NOT_IMPLEMENTED.message, Exceptions.NOT_IMPLEMENTED.code, "Find Emitter " + this.constructor.name);
    };

    public async save(options: any | string = {}): Promise<any> {
        let savedData;
        return await this.beforeValidate()
            .then(() => {
                return this.validate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(Exceptions.INVALID.message, Exceptions.INVALID.code, valid);
            })
            .then(() => this.beforeSave())
            .then(() => this.saveEmitter(options))
            .then((_savedData) => {
                savedData = _savedData;
                return this.afterSave();
            })
            .then(() => {
                return savedData;
            })
    }

    protected abstract saveEmitter(options): Promise<any>;

    protected beforeValidate(): Promise<void>|void {
        return 'sugBeforeValidate' in (this as any)
            ? (<any>this).sugBeforeValidate() || Promise.resolve()
            : Promise.resolve();
    }

    public validate(): Promise<string | boolean> {
        return 'sugValidate' in (this as any)
            ? (<any>this).sugValidate().then(valid => (valid === undefined) ? true : !!valid)
            : Promise.resolve(true);
    };

    protected beforeSave(): Promise<void> {
        return "sugBeforeSave" in (this as any)
            ? (<any>this).sugBeforeSave()|| Promise.resolve()
            : Promise.resolve();
    };

    protected afterSave(): Promise<void> {
        return 'sugAfterSave' in (this as any)
            ? (<any>this).sugAfterSave()|| Promise.resolve()
            : Promise.resolve();
    };

    public async update(options: any | string = {}): Promise<any> {
        let updatedData;
        return await this.beforeValidate()
            .then(() => {
                return this.validate();
            })
            .then((valid) => {
                if (valid !== true)
                    throw new SugoiModelException(Exceptions.INVALID.message, Exceptions.INVALID.code, valid);
            })
            .then(() => this.beforeUpdate())
            .then(() => this.updateEmitter(options))
            .then((_updatedData) => {
                updatedData = _updatedData;
                return this.afterUpdate();
            })
            .then(() => {
                return updatedData;
            });
    }

    protected abstract updateEmitter(options): Promise<any>;

    public beforeUpdate(): Promise<void> {
        return 'sugBeforeUpdate' in (this as any)
            ? (<any>this).sugBeforeUpdate()|| Promise.resolve()
            : Promise.resolve();
    };

    public afterUpdate(): Promise<void> {
        return 'sugAfterUpdate' in (this as any)
            ? (<any>this).sugAfterUpdate() || Promise.resolve()
            : Promise.resolve();
    };

    protected abstract removeEmitter(query: any): Promise<any>;

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