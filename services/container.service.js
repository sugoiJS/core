"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
class ContainerService {
    static get container() {
        return this._container;
    }
    static initContainer(config) {
        this._container = new inversify_1.Container(config);
        return ContainerService.container;
    }
    static register(...repos) {
        repos.forEach(injectable => {
            this.container.bind(injectable).to(injectable);
        });
        return ContainerService.container;
    }
    static inject(Class) {
        return this.container.get(Class);
    }
    static unregister(identifier) {
        this.container.unbind(identifier);
    }
}
ContainerService._container = new inversify_1.Container({ defaultScope: "Singleton", autoBindInjectable: true });
exports.ContainerService = ContainerService;
