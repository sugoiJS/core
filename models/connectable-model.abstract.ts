import {ModelAbstract} from "./model.abstract";
import {Connection} from "../classes/connection.class";
import {Exceptions} from "../constants/exceptions.constant";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";
import {CONNECTION_STATUS} from "../constants/connection-status.constant";
import {GenericException} from "../exceptions/generic.exception";
import {IConnectionConfig} from "../interfaces/connection-config.interface";

export abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, Connection> = new Map();

    protected static connectionName: string = "default";

    constructor() {
        super()
    }

    public static setConnection(configData: IConnectionConfig, connectionName: string = "default") {
        configData.connectionName = connectionName;
        this.connections.set(connectionName, Connection.clone(configData));
        this.connect(connectionName);

    }

    public static getConnection(connectionName: string = "default"): Connection {
        return this.connections.has(connectionName)
            ? this.connections.get(connectionName)
            : null;
    }

    public static connect(connectionName:string = this.connectionName): Observable<any> {
        const connection = this.connections.get(ConnectableModel.connectionName);
        if (!connection) {
            throw new GenericException(Exceptions.CONFIGURATION_MISSING.message, Exceptions.CONFIGURATION_MISSING.code);
        }

        if (connection.isConnected()) {
            return Observable.of(connection.connection);
        } else {
            return this.connectEmitter(connection)
                .pipe(
                    map((connectionItem) => {
                        connection.setStatus(CONNECTION_STATUS.CONNECTED);
                        connection.setConnection(connectionItem);
                        return connectionItem;
                    })
                );
        }
    }

    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Observable<any>} - connection item
     */
    public static connectEmitter(connection: Connection): Observable<any> {
        throw new GenericException(Exceptions.NOT_IMPLEMENTED.message, Exceptions.NOT_IMPLEMENTED.code, "connectEmitter");
    }

    public static disconnect(connectionName: string) {
        this.connections.has(connectionName)
            ? this.connections.get(connectionName).disconnect()
            : null
    }
}