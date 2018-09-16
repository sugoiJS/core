import {Container, interfaces} from "inversify";
import {ContainerRepo} from "../index";

export class ContainerService {
    private static _container: Container = new Container({ defaultScope: "Singleton" ,autoBindInjectable: true });

    static get container(){
        return this._container;
    }

    public static initContainer(config:interfaces.ContainerOptions){
        this._container = new Container(config)
    }


    public static register(...repos: Array<ContainerRepo>): Container {
        repos.forEach(repo => {
            this.container.bind(repo.symbol).to(repo.dep);
        });

        return ContainerService.container;
    }

    public static inject<T = any>(Class:interfaces.ServiceIdentifier<T>):T {
        return this.container.get(Class) as T;

    }

    public static unregister(identifier:interfaces.ServiceIdentifier<any>){
        this.container.unbind(identifier);
    }
}