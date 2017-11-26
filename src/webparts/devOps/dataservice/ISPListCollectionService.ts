import {ISPListCollection } from "./";
export interface ISPListCollectionService {
    getListData(): Promise<ISPListCollection>;
}