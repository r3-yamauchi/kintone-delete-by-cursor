"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class BulkDel {
    constructor(util) {
        this.util = util;
    }
    bulkDelete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let bulkIds = [];
            let start = 0;
            let end = 0;
            while (ids.length > end) {
                end += 100;
                if (ids.length < end) {
                    end = ids.length;
                }
                const slicedIds = ids.slice(start, end);
                if (bulkIds.length >= 20) {
                    yield this.bulkRequest(bulkIds);
                    bulkIds = [];
                }
                bulkIds.push(slicedIds);
                start += 100;
            }
            if (bulkIds.length > 0) {
                yield this.bulkRequest(bulkIds);
            }
        });
    }
    bulkRequest(bulkIds) {
        return new Promise((resolve, reject) => {
            const requests = [];
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
            request_1.default(options, (error, response, body) => {
                if (error) {
                    console.log("error: ", JSON.stringify(error, null, 2));
                    console.log("response: ", JSON.stringify(response, null, 2));
                }
                resolve(body.results);
            });
        });
    }
}
exports.BulkDel = BulkDel;
