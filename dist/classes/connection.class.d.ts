import { IConnectionConfig } from "../interfaces/connection-config.interface";
import { CONNECTION_STATUS } from "../constants/connection-status.constant";
export declare class Connection implements IConnectionConfig {
    hostName: string;
    db: string;
    port: number;
    user?: string;
    password?: string;
    authDB?: string;
    status: CONNECTION_STATUS;
    connectionName: string;
    connection: any;
    protected constructor(hostName: string, db: string, port: number);
    static builder(hostName: string, db: string, port?: number): Connection;
    static clone(config: IConnectionConfig): Connection;
    setCredentials(user: string, password: string): this;
    setStatus(status: CONNECTION_STATUS): this;
    setAuthDB(db: string): this;
    setConnectionName(name?: string): void;
    isConnected(): boolean;
    getConnectionString(): string;
    disconnect(): Promise<any>;
    setConnection(connection: any): void;
    getConnection(): any;
}
