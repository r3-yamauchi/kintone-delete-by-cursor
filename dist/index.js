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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const readlineSync = __importStar(require("readline-sync"));
const AppInfo_1 = require("./AppInfo");
const BulkDel_1 = require("./BulkDel");
const messages_1 = require("./messages");
const Query_1 = require("./Query");
const Util_1 = require("./Util");
const deleteRecords = (util, query, cursorID) => __awaiter(this, void 0, void 0, function* () {
    const bulkDel = new BulkDel_1.BulkDel(util);
    let ids = [];
    let cnt = 0;
    for (;;) {
        // カーソルを使用してレコードを取得
        const result = yield query.getRecordsByCursor(cursorID);
        ids.push(...util.getRecordIDs(result.records));
        if (!result.next) {
            break;
        }
        if (ids.length >= 2000) {
            yield bulkDel.bulkDelete(ids);
            cnt += ids.length;
            process.stdout.write(`${cnt} records deleted`);
            ids = [];
        }
    }
    if (ids.length > 0) {
        yield bulkDel.bulkDelete(ids);
        cnt += ids.length;
    }
    return cnt;
});
function run(domain, appId, guestSpaceId, userName, password, queryString, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lang } = options;
        const m = messages_1.getBoundMessage(lang);
        const util = new Util_1.Util(domain, appId, guestSpaceId, userName, password);
        const query = new Query_1.Query(util);
        let cursorID = "";
        try {
            // ログイン情報のチェックとアプリ情報の取得
            const appInfo = new AppInfo_1.AppInfo(util);
            const info = yield appInfo.getAppInfo();
            if (!info || !info.appId) {
                console.log(chalk_1.default.red(m("Error_failedLogin")));
                return;
            }
            console.log(`${info.appId}: ${info.name}`);
            if (queryString) {
                console.log(`${m("Info_yourQuery")}${queryString}`);
            }
            // カーソルの作成
            const cur = yield query.getCursor(queryString);
            if (!cur || !cur.id || cur.totalCount === undefined) {
                console.log(chalk_1.default.red(m("Error_failedCreateCursor")));
                return;
            }
            // レコード削除を実行するかどうか問い合わせる
            cursorID = cur.id;
            console.log(`${cur.totalCount}${m("Info_recordsExists")}`);
            if (!readlineSync.keyInYN(m("Q_YesOrNo"))) {
                console.log(m("Info_finishWithoutProcess"));
                yield query.deleteCursor(cursorID);
                return;
            }
            // レコードを削除する
            console.log(m("Info_startProcess"));
            const cnt = yield deleteRecords(util, query, cursorID);
            process.stdout.write(`${cnt}${m("Info_completed")}`);
            yield query.deleteCursor(cursorID);
            console.log("");
        }
        catch (e) {
            console.error(m("Error"), e);
            if (cursorID) {
                yield query.deleteCursor(cursorID);
            }
            process.exit(1);
        }
    });
}
exports.run = run;
// run("foo.cybozu.com", 1, 0, "userid", "password", "$id < 2", {
//   lang: "ja"
// }).then(() => {
//   console.log("finish");
// });
