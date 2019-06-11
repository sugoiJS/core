import {OnEvent} from "../../decorators";

export class PlainClass {
    static counter: number = 0;

    static throwError(err){
        throw err;
    }

    @OnEvent('increment')
    static increment(amount: number){
        this.counter += amount
    }

    @OnEvent('incrementOnce', true)
    static incrementOnce(amount: number){
        this.counter += amount
    }

    @OnEvent('incrementChannel', true, 'SECOND_CHANNEL')
    static incrementChannel(amount: number){
        this.counter += amount
    }
}