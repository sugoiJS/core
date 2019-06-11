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
import {DecorateProperty} from "./utilities/decorate-property.until";

const Injectable = injectable;
const PostConstruct = postConstruct;
const Inject = inject;
const MultiInject = multiInject;
const Decorate = decorate;
const decorateProperty = DecorateProperty;
const Optional = optional;

export {
    Container,
    injectable,
    decorate,
    decorateProperty,
    DecorateProperty,
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