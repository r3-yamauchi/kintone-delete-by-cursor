"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    constructor(domain, appId, guestSpaceId, userName, password) {
        this.domain = domain;
        this.appId = appId;
        this.guestSpaceId = guestSpaceId;
        const target = `${userName}:${password}`;
        this.auth = Buffer.alloc(target.length, target).toString("base64");
    }
    getRecordIDs(records) {
        const ids = [];
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
    createRequestOption(input) {
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
    getApiPath(api) {
        return this.guestSpaceId
            ? `/k/guest/${this.guestSpaceId}/v1/${api}.json`
            : `/k/v1/${api}.json`;
    }
    getApiUrl(api) {
        return `https://${this.domain}${this.getApiPath(api)}`;
    }
}
exports.Util = Util;
