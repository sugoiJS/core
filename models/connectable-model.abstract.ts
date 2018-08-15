import {ModelAbstract} from "./model.abstract";
import {Connection} from "../classes/connection.class";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {CONNECTION_STATUS} from "../constants/connection-status.constant";
import {GenericException} from "../exceptions/generic.exception";
import {IConnectionConfig} from "../interfaces/connection-config.interface";

export abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, Connection> = new Map();

    protected static connectionName: string = "default";

    protected static ConnectionType: typeof Connection = Connection;

    constructor() {
        super()
    }

    public static setConnection(configData: IConnectionConfig, connectionName: string = "default"):Promise<any> {
        configData.connectionName = connectionName;
        const connection = this.ConnectionType.clone(configData);
        this.connections.set(connectionName, connection);
        return this.connect(connectionName);

    }

    public static getConnection(connectionName: string = "default"): Connection {
        return this.connections.has(connectionName)
            ? this.connections.get(connectionName)
            : null;
    }

    public static connect(connectionName: string = this.connectionName): Promise<any> {
        const connection = this.connections.get(ConnectableModel.connectionName);
        if (!connection) {
            throw new GenericException(EXCEPTIONS.CONFIGURATION_MISSING.message, EXCEPTIONS.CONFIGURATION_MISSING.code);
        }

        if (connection.isConnected()) {
            return Promise.resolve(connection.connection);
        } else {
            return this.connectEmitter(connection)
                .then((connectionItem) => {
                    connection.setConnection(connectionItem);
                    connection.setStatus(CONNECTION_STATUS.CONNECTED);
                    return connectionItem;
                })
                .catch(err => {
                    console.error(err);
                    connection.setStatus(CONNECTION_STATUS.DISCONNECTED);
                    throw err;
                });

        }
    }

    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Promise<any>} - connection item
     */
    public static connectEmitter(connection: Connection): Promise<any> {
        throw new GenericException(EXCEPTIONS.NOT_IMPLEMENTED.message, EXCEPTIONS.NOT_IMPLEMENTED.code, "connectEmitter");
    }

    public static disconnect(connectionName: string) {
        this.connections.has(connectionName)
            ? this.connections.get(connectionName).disconnect()
            : null
    }
}