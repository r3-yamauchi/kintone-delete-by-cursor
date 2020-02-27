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
const rest_api_client_1 = require("@kintone/rest-api-client");
class Util {
    constructor(domain, appId, guestSpaceId, userName, password) {
        this.domain = domain;
        this.appId = appId;
        this.guestSpaceId = guestSpaceId;
        this.client = new rest_api_client_1.KintoneRestAPIClient({
            baseUrl: `https://${this.domain}`,
            auth: {
                username: userName,
                password: password
            }
        });
    }
    getCursor(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const foo = yield this.client.record.createCursor({
                app: this.appId,
                fields: ["$id"],
                query: queryString,
                size: 500
            });
            return foo;
        });
    }
    getRecordIDs(records) {
        const ids = [];
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
    getApiPath(api) {
        return `/k/v1/${api}.json`;
        // return this.guestSpaceId
        //   ? `/k/guest/${this.guestSpaceId}/v1/${api}.json`
        //   : `/k/v1/${api}.json`;
    }
}
exports.Util = Util;
