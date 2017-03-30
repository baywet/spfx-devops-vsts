import { ISPListCollectionService, ISPListCollection } from "./";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IWebPartContext } from "@microsoft/sp-webpart-base";

export class HttpSPListCollectionService implements ISPListCollectionService {
    private _context:IWebPartContext;
    constructor(context: IWebPartContext) {
        this._context = context;
    }
    public getListData(): Promise<ISPListCollection> {
        return this._context.spHttpClient.get(this._context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json().then((value) => {
       return value as ISPListCollection;
      });
    });
    }
}