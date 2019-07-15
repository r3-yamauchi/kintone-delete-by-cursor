import request from "request";
import { Util } from "./Util";

interface AppInfoResponse {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
  createdAt: string;
  modifiedAt: string;
}

export class AppInfo {
  private util: Util;
  constructor(util: Util) {
    this.util = util;
  }

  public getAppInfo(): Promise<AppInfoResponse> {
    return new Promise<AppInfoResponse>((resolve, reject) => {
      const options = this.util.createRequestOption({
        method: "GET",
        api: "app",
        body: {
          id: this.util.appId
        }
      });
      request(options, (error: any, response: any, body: AppInfoResponse) => {
        if (error) {
          console.log("error: ", JSON.stringify(error, null, 2));
          console.log("response: ", JSON.stringify(response, null, 2));
        }
        // console.log(body);
        resolve(body);
      });
    });
  }
}
