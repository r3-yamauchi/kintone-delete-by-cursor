import * as inquirer from "inquirer";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";

interface Params {
  username?: string;
  password?: string;
  domain?: string;
  appid?: number;
  query?: string;
  lang: Lang;
}

export const inquireParams = ({
  username,
  password,
  domain,
  appid,
  query,
  lang
}: Params) => {
  const m = getBoundMessage(lang);
  const questions: inquirer.Question[] = [
    {
      type: "input",
      message: m("Q_Domain"),
      name: "domain",
      default: domain,
      when: () => !domain,
      validate: (v: string) => !!v
    },
    {
      type: "input",
      name: "username",
      message: m("Q_UserName"),
      default: username,
      when: () => !username,
      validate: (v: string) => !!v
    },
    {
      type: "password",
      name: "password",
      message: m("Q_Password"),
      default: password,
      when: () => !password,
      validate: (v: string) => !!v
    },
    {
      type: "input",
      name: "appid",
      message: m("Q_AppId"),
      default: appid,
      when: () => !appid,
      validate: (v: string) => !!v
    },
    {
      type: "input",
      name: "query",
      message: m("Q_QueryString"),
      default: query
    }
  ];

  return inquirer
    .prompt(questions)
    .then(answers =>
      Object.assign({ username, password, domain, appid, query }, answers)
    );
};
