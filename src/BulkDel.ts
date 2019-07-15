import request from "request";
import { Util } from "./Util";

type BulkDelRequests = Array<{
  method: string;
  api: string;
  payload: {
    app: number;
    ids: number[];
  };
}>;

export class BulkDel {
  private util: Util;
  constructor(util: Util) {
    this.util = util;
  }

  public async bulkDelete(ids: number[]): Promise<void> {
    let bulkIds: number[][] = [];
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

  private bulkRequest(bulkIds: number[][]): Promise<[]> {
    return new Promise<[]>((resolve, reject) => {
      const requests: BulkDelRequests = [];
      bulkIds.forEach(ids => {
        requests.push({
          method: "DELETE",
          api: this.util.getApiPath("records"),
          payload: {
            app: this.util.appId,
            ids
          }
        });
      });
      const options = this.util.createRequestOption({
        method: "POST",
        api: "bulkRequest",
        body: {
          requests
        }
      });
      request(options, (error: any, response: any, body: any) => {
        if (error) {
          console.log("error: ", JSON.stringify(error, null, 2));
          console.log("response: ", JSON.stringify(response, null, 2));
        }
        resolve(body.results);
      });
    });
  }
}
