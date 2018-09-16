"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var ContainerService = /** @class */ (function () {
    function ContainerService() {
    }
    Object.defineProperty(ContainerService, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    ContainerService.initContainer = function (config) {
        this._container = new inversify_1.Container(config);
    };
    ContainerService.register = function () {
        var _this = this;
        var repos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            repos[_i] = arguments[_i];
        }
        repos.forEach(function (repo) {
            _this.container.bind(repo.symbol).to(repo.dep);
        });
        return ContainerService.container;
    };
    ContainerService.inject = function (Class) {
        return this.container.get(Class);
    };
    ContainerService.unregister = function (identifier) {
        this.container.unbind(identifier);
    };
    ContainerService._container = new inversify_1.Container({ defaultScope: "Singleton", autoBindInjectable: true });
    return ContainerService;
}());
exports.ContainerService = ContainerService;
