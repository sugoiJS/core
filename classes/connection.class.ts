import {IConnectionConfig} from "../interfaces/connection-config.interface";
import {injectable} from "inversify";
import {CONNECTION_STATUS} from "../constants/connection-status.constant";
import {Exceptions} from "../constants/exceptions.constant";
import {GenericException} from "../exceptions/generic.exception";


@injectable()
export class Connection implements IConnectionConfig {
    public user?: string;

    public password?: string;

    public authDB?: string;

    public status: CONNECTION_STATUS = CONNECTION_STATUS.DISCONNECTED;

    public connectionName: string;

    public connection: any;


    protected constructor(public hostName: string,
                          public db: string,
                          public port: number) {
        this.connectionName = this.db;
    }

    public static builder(hostName: string, db: string, port?: number) {
        return new Connection(hostName, db, port);
    }

    public static clone(config: IConnectionConfig): Connection {
        return Object.assign(Connection.builder(null, null), config);
    }

    public setCredentials(user: string, password: string) {
        this.user = user;
        this.password = password;
        return this;
    }

    public setStatus(status: CONNECTION_STATUS) {
        this.status = status;
        return this;
    }

    public setAuthDB(db: string) {
        this.authDB = db;
        return this;
    }

    public setConnectionName(name: string = this.db) {
        this.connectionName = name;
    }

    public isConnected(): boolean {
        return this.status === CONNECTION_STATUS.CONNECTED;
    }

    public getConnectionString():string {
        throw new GenericException(Exceptions.NOT_IMPLEMENTED.message, Exceptions.NOT_IMPLEMENTED.code, "getConnectionString");
    }

    public disconnect():Promise<any>{
        this.setStatus(CONNECTION_STATUS.DISCONNECTED);
        return Promise.resolve(null);
    }

    public setConnection(connection){
        this.connection = connection;
    }

    public getConnection(){
        return this.connection
    }
}