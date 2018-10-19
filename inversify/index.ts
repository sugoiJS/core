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
    AsyncContainerModule
} from "inversify";

const Injectable = injectable;
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