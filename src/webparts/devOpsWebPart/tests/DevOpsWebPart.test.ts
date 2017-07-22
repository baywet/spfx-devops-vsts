/// <reference types="mocha" />
/// <reference types="chai-as-promised" />

import { assert } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { DevOpsWebPartService } from "../DevOpsWebPart.service";

describe("DevOpsWebPartWebPart", () => {
  it("should do something", () => {
    assert.ok(true);
  });
});
const service: DevOpsWebPartService = new DevOpsWebPartService();
describe("DevOpsWebPartWebPart", () => {
  it("should add numbers Sync fluent", () => {
    const result:number = service.add(1, 3);
    return result.should.equal(4); // fluent API
  });
});

describe("DevOpsWebPartWebPart", () => {
  it("should add numbers sync assert", () => {
    const result:number = service.add(1, 3);
    assert.equal(result, 4, "result equals 4"); // assert/imperative API
  });
});

chai.use(chaiAsPromised);
describe("DevOpsWebPartWebPart", () => {
  it("should add numbers async", () => {
    const asyncResult:Promise<number> = service.addAsync(1, 3);
    return asyncResult.should.eventually.equal(4); // npm install chai-as-promised @types/chai-as-promised -D
  });
});