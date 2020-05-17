import chalk from "chalk";
import * as readlineSync from "readline-sync";
import { BulkDel } from "./BulkDel";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";
import { Util, App, Cursor } from "./Util";

const deleteRecords = async (util: Util, cursorID: string): Promise<number> => {
  const bulkDel = new BulkDel(util);
  let ids: string[] = [];
  let cnt = 0;
  for (;;) {
    // カーソルを使用してレコードを取得
    const result = await util.client.record.getRecordsByCursor({
      id: cursorID,
    });
    // レコードIDの一覧を蓄積
    ids.push(...util.getRecordIDs(result.records));

    // カーソルから取得できるレコードがなくなったら抜ける
    if (!result.next) {
      break;
    }
    // 2,000レコードに達したら削除処理を実行
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
  appId: string,
  guestSpaceId: string,
  userName: string,
  password: string,
  queryString: string,
  options: Option
): Promise<void> {
  const { lang } = options;
  const m = getBoundMessage(lang);
  const util = new Util(domain, appId, guestSpaceId, userName, password);
  const client = util.client;
  let info: App;
  let cursor: Cursor;
  let cursorID = "";

  try {
    // ログイン情報のチェックとアプリ情報の取得
    info = await client.app.getApp({ id: appId });
    console.log(`${info.appId}: ${info.name}`);
  } catch (e) {
    // console.error(e);
    console.log(chalk.red(m("Error_failedLogin")));
    return;
  }

  try {
    if (queryString) {
      console.log(`${m("Info_yourQuery")}${queryString}`);
    }
    cursor = await util.getCursor(queryString);
  } catch (e) {
    // console.error(e);
    console.log(chalk.red(m("Error_failedCreateCursor")));
    return;
  }

  try {
    // レコード削除を実行するかどうか問い合わせる
    cursorID = cursor.id;
    console.log(`${cursor.totalCount}${m("Info_recordsExists")}`);
    if (!readlineSync.keyInYN(m("Q_YesOrNo"))) {
      console.log(m("Info_finishWithoutProcess"));
      await client.record.deleteCursor({ id: cursorID });
      return;
    }

    console.log(m("Info_startProcess"));
    cursor = await util.getCursor(queryString);
    cursorID = cursor.id;

    // レコードを削除する
    const cnt = await deleteRecords(util, cursorID);
    process.stdout.write(`${cnt}${m("Info_completed")}`);
    console.log("");
  } catch (e) {
    console.error(m("Error"), e);
    if (cursorID) {
      await client.record.deleteCursor({ id: cursorID });
    }
    throw e;
  }
}

// run(
//   "mytenantname.cybozu.com",
//   "12345678",
//   "2",
//   "userid",
//   "password",
//   "$id < 23456",
//   {
//     lang: "ja",
//   }
// ).then(() => {
//   console.log("finish");
// });
