"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class AppInfo {
    constructor(util) {
        this.util = util;
    }
    getAppInfo() {
        return new Promise((resolve, reject) => {
            const options = this.util.createRequestOption({
                method: "GET",
                api: "app",
                body: {
                    id: this.util.appId
                }
            });
            request_1.default(options, (error, response, body) => {
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
exports.AppInfo = AppInfo;
