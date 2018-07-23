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
        var connection = this.ConnectionType.clone(configData);
        this.connections.set(connectionName, connection);
        return this.connect(connectionName);
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
            return Promise.resolve(connection.connection);
        }
        else {
            return this.connectEmitter(connection)
                .then(function (connectionItem) {
                connection.setConnection(connectionItem);
                connection.setStatus(connection_status_constant_1.CONNECTION_STATUS.CONNECTED);
                return connectionItem;
            })
                .catch(function (err) {
                console.error(err);
                connection.setStatus(connection_status_constant_1.CONNECTION_STATUS.DISCONNECTED);
                throw err;
            });
        }
    };
    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Promise<any>} - connection item
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
    ConnectableModel.ConnectionType = connection_class_1.Connection;
    return ConnectableModel;
}(model_abstract_1.ModelAbstract));
exports.ConnectableModel = ConnectableModel;
