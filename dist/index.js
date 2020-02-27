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
const BulkDel_1 = require("./BulkDel");
const messages_1 = require("./messages");
const Util_1 = require("./Util");
const deleteRecords = (util, cursorID) => __awaiter(void 0, void 0, void 0, function* () {
    const bulkDel = new BulkDel_1.BulkDel(util);
    let ids = [];
    let cnt = 0;
    for (;;) {
        // カーソルを使用してレコードを取得
        const result = yield util.client.record.getRecordsByCursor({
            id: cursorID
        });
        // レコードIDの一覧を蓄積
        ids.push(...util.getRecordIDs(result.records));
        // カーソルから取得できるレコードがなくなったら抜ける
        if (!result.next) {
            break;
        }
        // 2,000レコードに達したら削除処理を実行
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
        const client = util.client;
        let info;
        let cursor;
        let cursorID = "";
        try {
            // ログイン情報のチェックとアプリ情報の取得
            info = yield client.app.getApp({ id: appId });
            console.log(`${info.appId}: ${info.name}`);
        }
        catch (e) {
            // console.error(e);
            console.log(chalk_1.default.red(m("Error_failedLogin")));
            return;
        }
        try {
            if (queryString) {
                console.log(`${m("Info_yourQuery")}${queryString}`);
            }
            cursor = yield util.getCursor(queryString);
        }
        catch (e) {
            // console.error(e);
            console.log(chalk_1.default.red(m("Error_failedCreateCursor")));
            return;
        }
        try {
            // レコード削除を実行するかどうか問い合わせる
            cursorID = cursor.id;
            console.log(`${cursor.totalCount}${m("Info_recordsExists")}`);
            if (!readlineSync.keyInYN(m("Q_YesOrNo"))) {
                console.log(m("Info_finishWithoutProcess"));
                yield client.record.deleteCursor({ id: cursorID });
                return;
            }
            console.log(m("Info_startProcess"));
            cursor = yield util.getCursor(queryString);
            cursorID = cursor.id;
            // レコードを削除する
            const cnt = yield deleteRecords(util, cursorID);
            process.stdout.write(`${cnt}${m("Info_completed")}`);
            console.log("");
        }
        catch (e) {
            console.error(m("Error"), e);
            if (cursorID) {
                yield client.record.deleteCursor({ id: cursorID });
            }
            throw e;
        }
    });
}
exports.run = run;
// run(
//   "mytenantname.cybozu.com",
//   "12345678",
//   "0",
//   "userid",
//   "password",
//   "$id < 23456",
//   {
//     lang: "ja"
//   }
// ).then(() => {
//   console.log("finish");
// });
