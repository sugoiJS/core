import {Container, interfaces} from "inversify";
import {ContainerRepo} from "../index";

export class ContainerService {
    private static container: Container = new Container({ defaultScope: "Singleton" ,autoBindInjectable: true });

    public static registerContainer(...repos: Array<ContainerRepo>): Container {
        repos.forEach(repo => {
            ContainerService.container.bind(repo.symbol).to(repo.dep);
        });

        return ContainerService.container;
    }

    public static getRepo(Class:interfaces.ServiceIdentifier<any>) {
        return ContainerService.container.get(Class);

    }
}