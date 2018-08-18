# @Sugoi\core

![Sugoi logo](https://www.sugoijs.com/assets/logo_inverse.png)


## Introduction
SugoiJS™ is a minimal modular framework,

which gives you the ability to use only what you need, fast.

this is a standalone module that can be functional separately (as all of the SugoiJS™ modules).

## Installation

> npm install --save @sugoi/core

On your main application file import ReflectMetaData


## Policy



## ORM

Sugoi core module contains ready to extend ORM Models of two types:

### 1. Connectable Model

Models of this type have direct connection to the storage unit.

Its most common usage is for TCP connection.

Example (by the @sugoi/mongodb package implementation):

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

### 2. RESTFUL Model

Models of this type don't have direct connection to the storage unit.

The communication is done by a single request. The connection closes as soon as the request is completed.

Common usage is restful requests.

Example:

    export class MicroServiceModel extends ModelAbstract{

        constructor(){
            super();
        }

    }


### CRUD Implementation

For CRUD support, you can implement your CRUD logic under each of the CRUD emitters:

#### 1. SaveEmitter

    public saveEmitter(options:any = {}): Promise<any> {
            return rp({
                method: 'POST',
                uri: 'https://api.example.com/myendpoint',
                body:this,
                json: true
            })
    }



#### 2. FindEmitter

    protected static findEmitter(query: any, options = {}): Promise<any> {
            return rp({
                method: 'GET',
                uri: 'https://api.example.com/myendpoint',
                qs:query,
                json: true
            })
    }




#### 3. UpdateEmitter

    public updateEmitter(options:any = {}): Promise<any> {
            return rp({
                method: 'PUT',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body:this,
                json: true
            })
    }



#### 4. RemoveEmitter

    protected removeEmitter(query = {}): Promise<any> {
            return rp({
                method: 'DELETE',
                uri: `https://api.example.com/myendpoint/${this.id}`,
                body: this,
                json: true
            })
    }


#### Lifecycle Hooks

SugoiJS ORM uses predefined lifecycle hooks that can be implemented by interfaces:

1. IBeforeValidate
2. IValidate
3. IBeforeSave \ IBeforeUpdate
4. IAfterSave \ IAfterUpdate


![SugoiJS Lifecycle hooks](https://www.sugoijs.com/assets/lifecycle.png)

## Container

SugoiJS re-exports [Inversify container class](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md)
for support singleton injectable (autowire) services.

By using Containers you can achieve singleton services solutions for request\application liftime.


## Exceptions

SugoiJS provides base abstract exception(error) class which can be extended and used for exceptions handling

    SugoiError:{
        code:number;
        message:string;
        data:Array<any>;
    }

Feel free to extend this class to identify your own error by:

    switch(err.constructor.name){
        case "MySugoiError":
            //handled error
            break;
        default:
            throw err;
    }

Or by:

    if( err instanceof MySugoiError){
        //handled error
    }else{
        throw err;
    }

## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)