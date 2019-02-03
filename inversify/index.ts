import {
    Container,
    injectable,
    decorate,
    optional,
    inject,
    multiInject,
    ContainerModule,
    multiBindToService,
    interfaces,
    LazyServiceIdentifer,
    AsyncContainerModule,
    postConstruct

} from "inversify";

const Injectable = injectable;
const PostConstruct = postConstruct;
const Inject = inject;
const MultiInject = multiInject;
const Decorate = decorate;
const Optional = optional;

export {
    Container,
    injectable,
    decorate,
    optional,
    inject,
    postConstruct,
    PostConstruct,
    Injectable,
    Inject,
    Decorate,
    Optional,
    multiInject,
    multiBindToService,
    ContainerModule,
    interfaces,
    LazyServiceIdentifer,
    AsyncContainerModule
}