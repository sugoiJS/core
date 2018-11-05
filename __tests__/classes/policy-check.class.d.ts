export interface IEntity {
    id: any;
    num: any;
    active: any;
}
export declare class PolicyCheck {
    verifyData: number;
    entity: IEntity;
    setEntity(entity: IEntity): void;
    myName(): string;
}
