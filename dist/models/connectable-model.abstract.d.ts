import { ModelAbstract } from "./model.abstract";
import { Connection } from "../classes/connection.class";
import { IConnectionConfig } from "../interfaces/connection-config.interface";
export declare abstract class ConnectableModel extends ModelAbstract {
    protected static connections: Map<string, Connection>;
    protected static connectionName: string;
    protected static ConnectionType: typeof Connection;
    constructor();
    static setConnection(configData: IConnectionConfig, connectionName?: string): Promise<any>;
    static getConnection(connectionName?: string): Connection;
    static connect(connectionName?: string): Promise<any>;
    /**
     * Connect to service and return connection for further use
     * @param {Connection} connection
     * @returns {Promise<any>} - connection item
     */
    static connectEmitter(connection: Connection): Promise<any>;
    static disconnect(connectionName: string): void;
}
