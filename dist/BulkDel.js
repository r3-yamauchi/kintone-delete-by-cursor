"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDel = void 0;
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
        return __awaiter(this, void 0, void 0, function* () {
            const requests = [];
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
                const res = yield this.util.client.bulkRequest({ requests });
                return res;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
}
exports.BulkDel = BulkDel;
