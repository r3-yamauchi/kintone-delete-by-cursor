# kintone-delete-by-cursor

## Usage

```
% npx github:r3-yamauchi/kintone-delete-by-cursor \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--appid ${yourAppId} \
--query ${yourQueryString}
```

## Options

```
  Usage
    $ npx github:r3-yamauchi/kintone-delete-by-cursor
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
```

If you ommit the options, you can input the options interactively.

```
% npx github:r3-yamauchi/kintone-delete-by-cursor
? Input your Kintone subdomain (example.cybozu.com): example.cybozu.com
? Input your username: hoge
? Input your password: [hidden]
? Input your appId: 999
? Input your query string: $id < 100
```

## LICENSE

MIT License
