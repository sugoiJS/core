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