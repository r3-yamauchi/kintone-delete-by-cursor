import request from "request";
import { Util } from "./Util";

interface CreateCursorResponse {
  id: string;
  totalCount: number;
}

interface CursorRecordResponse {
  records: [];
  next: boolean;
}

export class Query {
  private util: Util;
  constructor(util: Util) {
    this.util = util;
  }

  public getCursor(query: string): Promise<CreateCursorResponse> {
    return new Promise<CreateCursorResponse>((resolve, reject) => {
      const options = this.util.createRequestOption({
        method: "POST",
        api: "records/cursor",
        body: {
          app: this.util.appId,
          fields: ["$id"],
          query,
          size: 500
        }
      });
      request(
        options,
        (error: any, response: any, body: CreateCursorResponse) => {
          if (error) {
            console.log("error: ", JSON.stringify(error, null, 2));
            console.log("response: ", JSON.stringify(response, null, 2));
          }
          resolve(body);
        }
      );
    });
  }

  public getRecordsByCursor(id: string): Promise<CursorRecordResponse> {
    return new Promise<CursorRecordResponse>((resolve, reject) => {
      const options = this.util.createRequestOption({
        method: "GET",
        api: "records/cursor",
        body: {
          id
        }
      });
      request(
        options,
        (error: any, response: any, body: CursorRecordResponse) => {
          if (error) {
            console.log("error: ", JSON.stringify(error, null, 2));
            console.log("response: ", JSON.stringify(response, null, 2));
          }
          // console.log(body);
          resolve(body);
        }
      );
    });
  }

  public deleteCursor(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const options = this.util.createRequestOption({
        method: "DELETE",
        api: "records/cursor",
        body: {
          id
        }
      });
      request(options, (error: any, response: any, body: any) => {
        if (error) {
          console.log("error: ", JSON.stringify(error, null, 2));
          console.log("response: ", JSON.stringify(response, null, 2));
        }
        // console.log(body);
        resolve(body);
      });
    });
  }

  public queryRecords(query: string): Promise<[]> {
    return new Promise<[]>((resolve, reject) => {
      const options = this.util.createRequestOption({
        method: "GET",
        api: "records",
        body: {
          app: this.util.appId,
          fields: ["$id"],
          query,
          totalCount: true
        }
      });
      request(options, (error: any, response: any, body: any) => {
        if (error) {
          console.log("error: ", JSON.stringify(error, null, 2));
          console.log("response: ", JSON.stringify(response, null, 2));
        }
        resolve(body.records);
      });
    });
  }
}
