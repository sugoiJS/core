import { Container, interfaces } from "inversify";
import { ContainerRepo } from "../index";
export declare class ContainerService {
    private static container;
    static register(...repos: Array<ContainerRepo>): Container;
    static inject<T = any>(Class: interfaces.ServiceIdentifier<T>): T;
    static unregister(identifier: interfaces.ServiceIdentifier<any>): void;
}
