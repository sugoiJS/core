# @Sugoi\core

![Sugoi logo](https://www.sugoijs.com/assets/logo_inverse.png)


## Introduction
Sugoi is a minimal modular framework,

which gives you the ability to use only what you need, fast.

As all of the "Sugoi" modules, this module is stand alone and can act without other Sugoi modules.

## Installation

> npm install --save @sugoi/core

## ORM

Sugoi core module contain ready to extend ORM Models of two types:

##### 1. Connectable Model

Models of this type have direct connection to the storage unit,
most common usage for DBs connection

Example by @sugoi/mongodb package implementation:

    import {Connection,ConnectableModel} from "@sugoi/core";

    export class MongoModel extends ConnectableModel{
        protected static ConnectionType:Connection = MongoConnection;

        constructor() {
            super();
        }

        public static connectEmitter(connection: MongoConnection): Promise<{ dbInstance: Db, client: MongoClient }> {
                const connectionConfig = {
                    authSource: connection.authDB
                };

                return MongoClient.connect(connection.getConnectionString(), connectionConfig)
                    .then((client: MongoClient) => {
                        return {client}
                    });
            }
    }

##### 2. RESTFUL Model

Models of this type does not have direct connection to the storage unit,
communication done by single request which get close as soon it's completed,
Common usage is restful requests.

Example:

    export class MicroServiceModel extends ModelAbstract{

        constructor(){
            super();;
        }

    }


#### CRUD Implementation

For support CRUD you able to implement your logic under each of the CRUD emitters:

##### 1. SaveEmitter

    public saveEmitter(options:any = {}): Promise<any> {
            return rp({
                method: 'POST',
                uri: 'https://api.example.com/myendpoint',
                body:this,
                json: true
            })
    }

##### 2. FindEmitter

    protected static findEmitter(query: any, options = {}): Promise<any> {
            return rp({
                method: 'GET',
                uri: 'https://api.example.com/myendpoint',
                qs:query,
                json: true
            })
    }

##### 3. UpdateEmitter

    public updateEmitter(options:any = {}): Promise<any> {
            return rp({
                method: 'PUT',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body:this,
                json: true
            })
    }

##### 4. RemoveEmitter

    protected removeEmitter(query = {}): Promise<any> {
            return rp({
                method: 'DELETE',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body: this,
                json: true
            })
    }


#### Lifecycle Hooks

Sugoi ORM use known lifecycle hooks which can implemented by interfaces:

1. IBeforeValidate
2. IValidate
3. IBeforeSave \ IBeforeUpdate
4. IAfterSave \ IAfterUpdate


![Sugoi logo](https://www.sugoijs.com/assets/lifecycle.png)

#### Container

#### Exceptions


## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)