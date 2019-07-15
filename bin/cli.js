#!/usr/bin/env node

"use strict";

const osLocale = require("os-locale");
const meow = require("meow");
const { run } = require("../dist/index");
const { inquireParams } = require("../dist/params");
const { getDefaultLang } = require("../dist/lang");
// const { getMessage } = require("../dist/messages");

const {
  KINTONE_DOMAIN,
  KINTONE_USERNAME,
  KINTONE_PASSWORD,
  KINTONE_APPID
} = process.env;

const cli = meow(
  `
  Usage
    $ kintone-delete-by-cursor
  Options
    --domain Domain of your kintone
    --appid AppId of target kintone app
    --query Query String for target records
    --username Login username
    --password User's password
    --guestspaceid Guest space id of space to which your app belongs
    --lang Using language (en or ja)

    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    appid: KINTONE_APPID
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
`,
  {
    flags: {
      domain: {
        type: "string",
        default: KINTONE_DOMAIN
      },
      appid: {
        type: "int",
        default: KINTONE_APPID
      },
      guestspaceid: {
        type: "int",
        default: 0
      },
      query: {
        type: "string",
        default: ""
      },
      username: {
        type: "string",
        default: KINTONE_USERNAME
      },
      password: {
        type: "string",
        default: KINTONE_PASSWORD
      },
      lang: {
        type: "string",
        default: getDefaultLang(osLocale.sync())
      }
    }
  }
);

const {
  username,
  password,
  domain,
  appid,
  guestspaceid,
  query,
  lang
} = cli.flags;
const options = { lang };

const wait = ms => new Promise(r => setTimeout(r, ms));

wait(0)
  .then(() => inquireParams({ username, password, domain, appid, query, lang }))
  .then(({ username, password, domain, query, appid }) =>
    run(domain, appid, guestspaceid, username, password, query, options)
  );
