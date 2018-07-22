"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var model_abstract_1 = require("./model.abstract");
var connection_class_1 = require("../classes/connection.class");
var exceptions_constant_1 = require("../constants/exceptions.constant");
var Observable_1 = require("rxjs/Observable");
var operators_1 = require("rxjs/operators");
var connection_status_constant_1 = require("../constants/connection-status.constant");
var generic_exception_1 = require("../exceptions/generic.exception");
var ConnectableModel = /** @class */ (function (_super) {
    __extends(ConnectableModel, _super);
    function ConnectableModel() {
        return _super.call(this) || this;
    }
    ConnectableModel.setConnection = function (configData, connectionName) {
        if (connectionName === void 0) { connectionName = "default"; }
        configData.connectionName = connectionName;
        this.connections.set(connectionName, connection_class_1.Connection.clone(configData));
        this.connect(connectionName);
    };
    ConnectableModel.getConnection = function (connectionName) {
        if (connectionName === void 0) { connectionName = "default"; }
        return this.connections.has(connectionName)
            ? this.connections.get(connectionName)
            : null;
    };
    ConnectableModel.connect = function (connectionName) {
        if (connectionName === void 0) { connectionName = this.connectionName; }
        var connection = this.connections.get(ConnectableModel.connectionName);
        if (!connection) {
            throw new generic_exception_1.GenericException(exceptions_constant_1.Exceptions.CONFIGURATION_MISSING.message, exceptions_constant_1.Exceptions.CONFIGURATION_MISSING.code);
        }
        if (connection.isConnected()) {
            return Observable_1.Observable.of(connection.connection);
        }
        else {
            return this.connectEmitter(connection)
                .pipe(operators_1.map(function (connectionItem) {
                connection.setStatus(connection_status_constant_1.CONNECTION_STATUS.CONNECTED);
                connection.setConnection(connectionItem);
                return connectionItem;
            }));
        }
    };
    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Observable<any>} - connection item
     */
    ConnectableModel.connectEmitter = function (connection) {
        throw new generic_exception_1.GenericException(exceptions_constant_1.Exceptions.NOT_IMPLEMENTED.message, exceptions_constant_1.Exceptions.NOT_IMPLEMENTED.code, "connectEmitter");
    };
    ConnectableModel.disconnect = function (connectionName) {
        this.connections.has(connectionName)
            ? this.connections.get(connectionName).disconnect()
            : null;
    };
    ConnectableModel.connections = new Map();
    ConnectableModel.connectionName = "default";
    return ConnectableModel;
}(model_abstract_1.ModelAbstract));
exports.ConnectableModel = ConnectableModel;
