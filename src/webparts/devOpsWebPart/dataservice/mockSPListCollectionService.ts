import { ISPListCollectionService, ISPList, ISPListCollection } from "./";
export class MockSPListCollectionService implements ISPListCollectionService {
    private _items: ISPList[] = [{ Title: "Mock List", Id: "1" },
                                        { Title: "Mock List 2", Id: "2" },
                                        { Title: "Mock List 3", Id: "3" }];

    public getListData(): Promise<ISPListCollection> {
        const listData: ISPListCollection = { value: this._items };
        return Promise.resolve(listData);
    }
}