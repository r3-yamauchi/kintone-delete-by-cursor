import chalk from "chalk";
import * as readlineSync from "readline-sync";
import { AppInfo } from "./AppInfo";
import { BulkDel } from "./BulkDel";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";
import { Query } from "./Query";
import { Util } from "./Util";

const deleteRecords = async (
  util: Util,
  query: Query,
  cursorID: string
): Promise<number> => {
  const bulkDel = new BulkDel(util);
  let ids: number[] = [];
  let cnt = 0;
  for (;;) {
    // カーソルを使用してレコードを取得
    const result = await query.getRecordsByCursor(cursorID);
    ids.push(...util.getRecordIDs(result.records));
    if (!result.next) {
      break;
    }
    if (ids.length >= 2000) {
      await bulkDel.bulkDelete(ids);
      cnt += ids.length;
      process.stdout.write(`${cnt} records deleted`);
      ids = [];
    }
  }

  if (ids.length > 0) {
    await bulkDel.bulkDelete(ids);
    cnt += ids.length;
  }
  return cnt;
};

interface Option {
  lang: Lang;
}

export async function run(
  domain: string,
  appId: number,
  guestSpaceId: number,
  userName: string,
  password: string,
  queryString: string,
  options: Option
): Promise<void> {
  const { lang } = options;
  const m = getBoundMessage(lang);
  const util = new Util(domain, appId, guestSpaceId, userName, password);
  const query = new Query(util);
  let cursorID = "";

  try {
    // ログイン情報のチェックとアプリ情報の取得
    const appInfo = new AppInfo(util);
    const info = await appInfo.getAppInfo();
    if (!info || !info.appId) {
      console.log(chalk.red(m("Error_failedLogin")));
      return;
    }
    console.log(`${info.appId}: ${info.name}`);
    if (queryString) {
      console.log(`${m("Info_yourQuery")}${queryString}`);
    }

    // カーソルの作成
    const cur = await query.getCursor(queryString);
    if (!cur || !cur.id || cur.totalCount === undefined) {
      console.log(chalk.red(m("Error_failedCreateCursor")));
      return;
    }

    // レコード削除を実行するかどうか問い合わせる
    cursorID = cur.id;
    console.log(`${cur.totalCount}${m("Info_recordsExists")}`);
    if (!readlineSync.keyInYN(m("Q_YesOrNo"))) {
      console.log(m("Info_finishWithoutProcess"));
      await query.deleteCursor(cursorID);
      return;
    }

    // レコードを削除する
    console.log(m("Info_startProcess"));
    const cnt = await deleteRecords(util, query, cursorID);
    process.stdout.write(`${cnt}${m("Info_completed")}`);
    await query.deleteCursor(cursorID);
    console.log("");
  } catch (e) {
    console.error(m("Error"), e);
    if (cursorID) {
      await query.deleteCursor(cursorID);
    }
    process.exit(1);
  }
}

// run("foo.cybozu.com", 1, 0, "userid", "password", "$id < 2", {
//   lang: "ja"
// }).then(() => {
//   console.log("finish");
// });
