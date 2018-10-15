import { Container, interfaces } from "inversify";
export declare class ContainerService {
    private static _container;
    static readonly container: Container;
    static initContainer(config: interfaces.ContainerOptions): Container;
    static register(...repos: Array<any>): Container;
    static inject<T = any>(Class: interfaces.ServiceIdentifier<T>): T;
    static unregister(identifier: interfaces.ServiceIdentifier<any>): void;
}
