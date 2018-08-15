import {Container, interfaces} from "inversify";
import {ContainerRepo} from "../index";

export class ContainerService {
    private static container: Container = new Container({ defaultScope: "Singleton" ,autoBindInjectable: true });

    public static register(...repos: Array<ContainerRepo>): Container {
        repos.forEach(repo => {
            ContainerService.container.bind(repo.symbol).to(repo.dep);
        });

        return ContainerService.container;
    }

    public static inject<T = any>(Class:interfaces.ServiceIdentifier<T>):T {
        return ContainerService.container.get(Class) as T;

    }

    public static unregister(identifier:interfaces.ServiceIdentifier<any>){
        this.container.unbind(identifier);
    }
}