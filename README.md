# @Sugoi\core

![Sugoi logo](https://www.sugoijs.com/assets/logo_inverse.png)


## Introduction
SugoiJS™ is a minimal modular framework,

which gives you the ability to use only what you need, fast.

this is a standalone module that can be functional separately (as all of the SugoiJS™ modules).

## Installation

> npm install --save @sugoi/core

On your main application file import ReflectMetaData



## Policies (Guards)

SugoiJS™ provides policy which can be use for guarding any function on the server.

The Policies use by two simple steps:

#### @Policy(policyId?:string)

This decorator register the function as policy validator.

This decorated function will be later can be use for guard our functions.

> policyId?: string - The id which will be use as an alias for calling this function, default is ${class name}.${function name}

#### @UsePolicy(policy: TPolicy|string, failedResponseCode: number = 400, ...policyMeta: any[])

This decorator declare the function guarded by policy.

> policy:TPolicy| string  - For set the ref policy, use the policy Id from previous section nor anonymous function reference.

> failedResponseCode: number - The code which will be under the exception in case the value does not meet the criterias.

> policyMeta: any[] - Any further payload data which should pass to the policy.

### Pre-defined policies:

@sugoi\core provide pre-defined policy for validating function arguments:

    ValidateSchemaPolicy(failedResponseCode: number = 400, ...policyMeta: TValidateSchemaMeta[])

> failedResponseCode: number  - The code which will be under the exception in case the value does not meet the criterias.

> policyMeta: TValidateSchemaMeta - Meta data for validation

    {
        schema: {[prop:string]:Comparable|Comparable}, - Comperable schema
        argIndex?: number, - Function argument index - default is 0
        keyInArg?: string  - Key in argument
    }

Example:
Schema -

    {
        role:{
            text:string//with regex  /([A-Z])+/i
        }
    }

Usage -

    @ValidateSchemaPolicy(400, {
            schema: {
                "role": Comparable.ofType(
                    {text: Comparable.ofType(ComparableTypes.STRING).setRegex("([A-Z])+", "i")}
                )
            },
            argIndex: 0
        })


### Build your own policies:

Policy can be any function of type TPolicy

>   TPolicy = (policyData?:{functionArgs?: any[], policyMeta?: any[]})=>(Promise < (true|any) > | (true|any))

When boolean `true` result means valid

## Container

SugoiJS™ re-exports [Inversify container class](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md)
for support singleton injectable (autowire) services.

By using Containers you can achieve singleton services solutions for request\application liftime.


## Exceptions

SugoiJS™ provides base abstract exception(error) class which can be extended and used for exceptions handling

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