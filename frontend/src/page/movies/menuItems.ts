import Cookies from "js-cookie";
import { ReactNode } from "react";

export interface IRoute {
  key: string;
  label: string;
  link: string;
  icon?: ReactNode;
  children?: IRoute[];
}

export const MenuSPJItems: IRoute[] = [
  {
    label: "Home",
    key: "1",
    link: "/",
  },
  {
    label: "CRUD Movie",
    key: "2",
    link: "/movies",
  },
];
