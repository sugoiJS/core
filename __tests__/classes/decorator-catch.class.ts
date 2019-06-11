import {Catch} from "../../decorators/catch.decorator";
import {SugoiPolicyError} from "../../policies/exceptions/policy-error.exception";
import {SugoiError} from "../../exceptions/sugoi-abstract.exception";

class MyError extends SugoiError{

}

class MyError2 extends SugoiError{

}

@Catch(()=>{
    return null;
},'MyError', MyError2)
export class DecoratorCatch{
    private static number: number = 1;
    private instanceNumber: number = 0;

    @Catch(function(err){
        console.log('catcher got an error', err);
        return this.instanceNumber - 1
    })
    catchCheck(numberToCheck: number){
        if(numberToCheck === 0){
            throw new MyError('testing1',321);
        }
        else if(numberToCheck === 1){
            throw new MyError2('testing2',321);
        }
        else if(numberToCheck === 2){
            throw new Error('test generic error');
        }
        return this.instanceNumber;
    }

    static classCatchCheck(numberToCheck: number){
        if(numberToCheck === 0){
            throw new MyError('testing1',321,null,false);
        }
        else if(numberToCheck === 1){
            throw new MyError2('testing2',321,null,false);
        }
        else if(!numberToCheck) {
            throw new Error('test')
        }
        return this.number;
    }

    @Catch(function(err: any){
        return false;
    }, Error)
    static catchCheckFallback(numberToCheck: number){
        if(numberToCheck === 0){
            throw new MyError('testing1',321);
        }
        else if(numberToCheck === 1){
            throw new MyError2('testing2',321);
        }
        else if(numberToCheck === null){
            throw new Error('test generic error');
        }
        return this.number;
    }
}
