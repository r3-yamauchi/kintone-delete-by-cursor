import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export declare type App = {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
  createdAt: string;
  creator: {
    code: string;
    name: string;
  };
  modifiedAt: string;
  modifier: {
    code: string;
    name: string;
  };
};

export declare type Cursor = {
  id: string;
  totalCount: string;
};

declare type Record = {
  [fieldCode: string]: any;
};

export class Util {
  public appId: string;
  public guestSpaceId: string;
  private domain: string;
  public client: KintoneRestAPIClient;

  constructor(
    domain: string,
    appId: string,
    guestSpaceId: string,
    userName: string,
    password: string
  ) {
    this.domain = domain;
    this.appId = appId;
    this.guestSpaceId = guestSpaceId;
    this.client = new KintoneRestAPIClient({
      baseUrl: `https://${this.domain}`,
      auth: {
        username: userName,
        password: password
      }
    });
  }

  public async getCursor(queryString: string): Promise<Cursor> {
    const foo = await this.client.record.createCursor({
      app: this.appId,
      fields: ["$id"],
      query: queryString,
      size: 500
    });
    return foo;
  }

  public getRecordIDs(records: Record[]): string[] {
    const ids: string[] = [];
    records.forEach(item => {
      // eslint-disable-next-line dot-notation
      const id = item["$id"]["value"];
      if (id) {
        ids.push(id);
      }
    });
    // console.log(ids);
    return ids;
  }

  public getApiPath(api: string): string {
    return `/k/v1/${api}.json`;
    // return this.guestSpaceId
    //   ? `/k/guest/${this.guestSpaceId}/v1/${api}.json`
    //   : `/k/v1/${api}.json`;
  }
}
