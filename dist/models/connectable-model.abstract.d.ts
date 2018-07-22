import { ModelAbstract } from "./model.abstract";
import { Connection } from "../classes/connection.class";
import { Observable } from "rxjs/Observable";
import { IConnectionConfig } from "../interfaces/connection-config.interface";
export declare abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, Connection>;
    protected static connectionName: string;
    constructor();
    static setConnection(configData: IConnectionConfig, connectionName?: string): void;
    static getConnection(connectionName?: string): Connection;
    static connect(connectionName?: string): Observable<any>;
    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Observable<any>} - connection item
     */
    static connectEmitter(connection: Connection): Observable<any>;
    static disconnect(connectionName: string): void;
}
