import { ISPListCollection } from '../dataservice/ISPListCollection';
import { ISPListCollectionService } from '../dataservice/ISPListCollectionService';
export class BusinessService {
    private _dataService:ISPListCollectionService;
    constructor(dataSerivce: ISPListCollectionService) {
        this._dataService = dataSerivce;
    }
    public async GetBusinessLogic(): Promise<number> {
        const lists:ISPListCollection = await this._dataService.getListData();
        return lists.value.length;
    }
}