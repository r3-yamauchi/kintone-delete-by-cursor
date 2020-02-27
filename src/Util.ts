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
  public guestSpaceId?: string;
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
    this.guestSpaceId =
      guestSpaceId && guestSpaceId !== "" && guestSpaceId !== "0"
        ? guestSpaceId
        : undefined;

    this.client = new KintoneRestAPIClient({
      baseUrl: `https://${this.domain}`,
      auth: {
        username: userName,
        password: password
      },
      guestSpaceId: this.guestSpaceId
    });
  }

  public async getCursor(queryString: string): Promise<Cursor> {
    const cur = await this.client.record.createCursor({
      app: this.appId,
      fields: ["$id"],
      query: queryString,
      size: 500
    });
    return cur;
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
    return this.guestSpaceId
      ? `/k/guest/${this.guestSpaceId}/v1/${api}.json`
      : `/k/v1/${api}.json`;
  }
}
