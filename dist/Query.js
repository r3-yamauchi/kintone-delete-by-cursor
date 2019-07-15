"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class Query {
    constructor(util) {
        this.util = util;
    }
    getCursor(query) {
        return new Promise((resolve, reject) => {
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
            request_1.default(options, (error, response, body) => {
                if (error) {
                    console.log("error: ", JSON.stringify(error, null, 2));
                    console.log("response: ", JSON.stringify(response, null, 2));
                }
                resolve(body);
            });
        });
    }
    getRecordsByCursor(id) {
        return new Promise((resolve, reject) => {
            const options = this.util.createRequestOption({
                method: "GET",
                api: "records/cursor",
                body: {
                    id
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
    deleteCursor(id) {
        return new Promise((resolve, reject) => {
            const options = this.util.createRequestOption({
                method: "DELETE",
                api: "records/cursor",
                body: {
                    id
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
    queryRecords(query) {
        return new Promise((resolve, reject) => {
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
            request_1.default(options, (error, response, body) => {
                if (error) {
                    console.log("error: ", JSON.stringify(error, null, 2));
                    console.log("response: ", JSON.stringify(response, null, 2));
                }
                resolve(body.records);
            });
        });
    }
}
exports.Query = Query;
