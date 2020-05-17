import { Util } from "./Util";

export declare type EndpointName =
  | "record"
  | "records"
  | "record/status"
  | "records/status"
  | "record/assignees";

type BulkDelRequests = Array<{
  method: string;
  endpointName: EndpointName;
  payload: {
    app: string;
    ids: string[];
  };
}>;

export class BulkDel {
  private util: Util;
  constructor(util: Util) {
    this.util = util;
  }

  public async bulkDelete(ids: string[]): Promise<void> {
    let bulkIds: string[][] = [];
    let start = 0;
    let end = 0;
    while (ids.length > end) {
      end += 100;
      if (ids.length < end) {
        end = ids.length;
      }

      const slicedIds = ids.slice(start, end);

      if (bulkIds.length >= 20) {
        await this.bulkRequest(bulkIds);
        bulkIds = [];
      }
      bulkIds.push(slicedIds);
      start += 100;
    }

    if (bulkIds.length > 0) {
      await this.bulkRequest(bulkIds);
    }
  }

  private async bulkRequest(
    bulkIds: string[][]
  ): Promise<{
    results: Array<{
      [K: string]: any;
    }>;
  }> {
    const requests: BulkDelRequests = [];
    bulkIds.forEach((ids) => {
      requests.push({
        method: "DELETE",
        endpointName: "records",
        payload: {
          app: this.util.appId,
          ids,
        },
      });
    });

    try {
      const res = await this.util.client.bulkRequest({ requests });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
