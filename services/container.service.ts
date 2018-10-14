import {Container, interfaces} from "inversify";

export class ContainerService {
    private static _container: Container = new Container({defaultScope: "Singleton", autoBindInjectable: true});

    static get container() {
        return this._container;
    }

    public static initContainer(config: interfaces.ContainerOptions): Container {
        this._container = new Container(config);
        return ContainerService.container;

    }


    public static register(...repos: Array<any>): Container {
        repos.forEach(injectable => {
            this.container.bind(injectable).to(injectable);
        });

        return ContainerService.container;
    }

    public static inject<T = any>(Class: interfaces.ServiceIdentifier<T>): T {
        return this.container.get(Class) as T;

    }

    public static unregister(identifier: interfaces.ServiceIdentifier<any>) {
        this.container.unbind(identifier);
    }
}