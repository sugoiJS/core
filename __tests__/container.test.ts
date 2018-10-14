import {ContainerService} from "../index";
import {PolicyCheck} from "./classes/policy-check.class";

beforeAll(() => {
    ContainerService.initContainer({
        autoBindInjectable: false,
        defaultScope: "Singleton"
    });
})
describe("Container handling test", () => {
    it("testing container interface",()=>{
        ContainerService.register(PolicyCheck);
        const test1 = ContainerService.inject(PolicyCheck);
        const test2 = ContainerService.inject(PolicyCheck);
        expect(test1).toEqual(test2);
        ContainerService.unregister(PolicyCheck);
        try {
            expect(ContainerService.inject(PolicyCheck)).toThrowError();
        }catch (err){}
    })
});