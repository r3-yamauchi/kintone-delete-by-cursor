"use strict";

import { Lang } from "./lang";

type LangMap = { [lang in Lang]: string };
type MessageMap = { [key in keyof typeof messages]: LangMap };

const messages = {
  Q_Domain: {
    en: "Input your Kintone subdomain (example.cybozu.com):",
    ja: "kintoneのドメインを入力してください (example.cybozu.com):",
  },
  Q_UserName: {
    en: "Input your username:",
    ja: "ログイン名を入力してください:",
  },
  Q_Password: {
    en: "Input your password:",
    ja: "パスワードを入力してください:",
  },
  Q_AppId: {
    en: "Input your appId:",
    ja: "アプリIDを入力してください:",
  },
  Q_QueryString: {
    en: "Input your query string:",
    ja: "(任意)クエリ式を入力してください:",
  },
  Q_YesOrNo: {
    en: "Do you want to delete records?",
    ja: "Do you want to delete records ?",
  },
  Info_yourQuery: {
    en: "Your query: ",
    ja: "クエリ式: ",
  },
  Info_recordsExists: {
    en: " records exists.",
    ja: "件のレコードが存在します。",
  },
  Info_finishWithoutProcess: {
    en: "Exit without processing",
    ja: "レコードを削除せずに終了します",
  },
  Info_startProcess: {
    en: "Start",
    ja: "レコード削除を開始します",
  },
  Info_completed: {
    en: "records have been deleted.",
    ja: "件のレコードを削除しました",
  },
  Error: {
    en: "An error occured",
    ja: "エラーが発生しました",
  },
  Error_retry: {
    en: "An error occured, retry with a new browser",
    ja: "エラーが発生しました。リトライします",
  },
  Error_failedLogin: {
    en: "Error: Login failed, please confirm your username and password",
    ja:
      "エラー: kintoneへのログインに失敗しました。ログイン名とパスワードを確認してください",
  },
  Error_failedCreateCursor: {
    en: "Error: Cannot create a cursor",
    ja: "エラー: カーソルを作成することができません",
  },
};

/**
 * Returns a message for the passed lang and key
 * @param lang
 * @param key
 */
export function getMessage(lang: keyof LangMap, key: keyof MessageMap): string {
  return messages[key][lang];
}

/**
 * Returns a function bound lang to getMessage
 * @param lang
 */
export function getBoundMessage(
  lang: keyof LangMap
): (key: keyof MessageMap) => string {
  return getMessage.bind(null, lang);
}
