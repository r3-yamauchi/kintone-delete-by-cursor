interface RequestInput {
  method: string;
  api: string;
  body: object;
}

interface RequestOption {
  method: string;
  uri: string;
  body: object;
  headers: object;
  json: boolean;
}

export class Util {
  public appId: number;
  private domain: string;
  private guestSpaceId: number;
  private auth: string;

  constructor(
    domain: string,
    appId: number,
    guestSpaceId: number,
    userName: string,
    password: string
  ) {
    this.domain = domain;
    this.appId = appId;
    this.guestSpaceId = guestSpaceId;
    const target = `${userName}:${password}`;
    this.auth = Buffer.alloc(target.length, target).toString("base64");
  }

  public getRecordIDs(records: []): number[] {
    const ids: number[] = [];
    records.forEach(item => {
      // tslint:disable-next-line: no-string-literal
      const id = item["$id"]["value"];
      if (id) {
        ids.push(id);
      }
    });
    // console.log(ids);
    return ids;
  }

  public createRequestOption(input: RequestInput): RequestOption {
    return {
      method: input.method,
      uri: this.getApiUrl(input.api),
      body: input.body,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Cybozu-Authorization": this.auth,
        "Content-Type": "application/json"
      },
      json: true
    };
  }

  public getApiPath(api: string): string {
    return this.guestSpaceId
      ? `/k/guest/${this.guestSpaceId}/v1/${api}.json`
      : `/k/v1/${api}.json`;
  }

  public getApiUrl(api: string): string {
    return `https://${this.domain}${this.getApiPath(api)}`;
  }
}
