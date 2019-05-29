# @Sugoi\core

![Sugoi logo](https://sugoijs.com/assets/logo_inverse.png)


[![npm version](https://badge.fury.io/js/%40sugoi%2Fcore.svg)](https://badge.fury.io/js/%40sugoi%2Fcore)
[![Build Status](https://travis-ci.org/sugoiJS/core.svg?branch=master)](https://travis-ci.org/sugoiJS/core)
[![codecov](https://codecov.io/gh/sugoiJS/core/branch/master/graph/badge.svg)](https://codecov.io/gh/sugoiJS/core)

## Introduction
SugoiJS is a minimal modular framework,

which gives you the ability to use only what you need, fast.

this is a standalone module that can be functional separately (as all of the SugoiJS modules).

The core module of SugoiJS provide common utilities to ease the development process.

The core module, use as utility  for all of SugoiJS modules.

## Installation

> npm install --save @sugoi/core

## tsconfig.json:

Under your tsconfig - compilerOptions set:

- `"target": "es2015"`

- `"emitDecoratorMetadata": true`

- `"experimentalDecorators": true`

- `"lib": ["es2015","dom"]`


#### Template

You are able to use the config template which was set for the @sugoi/demo application:

    {
      "compilerOptions": {
        "baseUrl": "./src",
        "allowJs": true,
        "target": "es2015",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
          "es2015",
          "dom"
        ],
        "typeRoots": [
          "./node_modules/@types"
        ],
        "types": [
          "body-parser",
          "express",
          "node"
        ]
      }
    }


# Content of the module:

## Utilities

### clone/cast

This method allows to cast plain object to class instance with/without applying the constructor.
This ability is common use for model based design.

### Decorate/DecorateProperty

provides the ability to decorate class, method or property in runtime.

### Container

SugoiJS re-exports [Inversify container class](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md)
for support singleton injectable (aka. Autowire) services.

By using Containers you can achieve singleton services solutions for request\application lifetime.

### Exceptions

SugoiJS provides base abstract exception(error) class which can be extended and used for exceptions handling

    SugoiError: {
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

## Pre-define decorators:

### @Catch(handler?: (err) => any, ...errors: Array<typeof Error | typeof SugoiError | string>)

Catch decorator gives the ability to catch and handle runtime errors for method or class level based on the exception type.

### @OnEvent(event: string, once?: boolean, channel?: string ) 

OnEvent decorator gives the ability to bind method to an event with channel based design.

### @Deprecated(msg?: string, throwException?: boolean);
 
Log usage of deprecated methods or throw an exception in case of usage.

### @Iterable()

Gives a class the ability to iterate throw it, decorate a class with this decorator allow to run for loops on the class properties.


## Policies (Guards/Filters)

SugoiJS provides the ability to apply filter functions on top of methods to 
reduce invalid payload checking.

For applying policy use the `UsePolicy` or `UsePolicySync` decorator:

    @UsePolicy(policy: TPolicy|string, failedResponseCode: number = 400, ...policyMeta: any[])
    @UsePolicySync(policy: TPolicy|string, failedResponseCode: number = 400, ...policyMeta: any[])

> policy:TPolicy | string  - For set the ref policy, use anonymous function.

> failedResponseCode: number - The code which will be under the exception in case the value does not meet the criteria.

> policyMeta: any[] - Any further payload data which should pass to the policy.
    
### Data types for policy:

    export type TPolicy = (policyData?: TPolicyPayload) => (Promise<TPolicyResults> | TPolicyResults); 
    export type TPolicyPayload = { functionArgs?: any[], policyMeta?: any[] };
    export type TPolicyResults = true | any; // true means valid, otherwise the value is invalid and the returned value return into the exception as data

### Pre-defined policies:

@sugoi\core provide pre-defined policy for validating function arguments:

    ValidateSchemaPolicy(failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[])

> failedResponseCode: number  - The code which will be under the exception in case the value does not meet the criterias.

> policyMeta: TValidateSchemaMeta - Meta data for validation

    {
        schema: {[prop:string]:ComparableSchema|ComparableSchema}, - Comperable schema
        argIndex?: number, - Function argument index - default is 0
        keyInArg?: string  - Path to validate under the argument 
    }

Example:
Schema -

    {
        role:{
            text:string // + check the regex - /([A-Z])+/i
        }
    }

Usage -

    @ValidateSchemaPolicy(400, {
            schema: {
                "role": ComparableSchema.ofType(
                    {text: ComparableSchema.ofType(SchemaTypes.STRING)
                                           .setRegex("([A-Z])+", "i")}
                )
            },
            argIndex: 0
        })

Another way:
    
    @ValidateSchemaPolicy(400, {
                schema: {
                   text: ComparableSchema.ofType(SchemaTypes.STRING)
                                               .setRegex("([A-Z])+", "i")}
                },
                argIndex: 0,
                keyInArg: 'role'
            })

## Documentation

You can find further information on [Sugoi official website](http://wiki.sugoijs.com)
