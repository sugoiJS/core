export interface IBeforeSave{
    sugBeforeSave():Promise<any>|void
}