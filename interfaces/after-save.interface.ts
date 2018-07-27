export interface IAfterSave {
    sugAfterSave():Promise<any> | void
}