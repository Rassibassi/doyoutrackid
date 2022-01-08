import { UrlObject } from "url";

import { TODAY_ROUTE_QUERY } from "./dates";

export enum ROUTE {
  listen = "listen",
  home = "home",
  today = "today",
  archive = "archive",
  tracks = "tracks",
}

export interface IRoute {
  label: string;
  url: Partial<UrlObject>;
}

export const ROUTES = new Map<ROUTE, IRoute>([
  [
    ROUTE.home,
    {
      label: "Home",
      url: {
        pathname: "/",
      },
    },
  ],
  [
    ROUTE.archive,
    {
      url: {
        pathname: "/archive",
      },
      label: "Archive",
    },
  ],
  [
    ROUTE.today,
    {
      url: {
        pathname: "/tracks",
        query: {
          date: TODAY_ROUTE_QUERY,
        },
      },
      label: "Today",
    },
  ],
  [
    ROUTE.tracks,
    {
      url: {
        pathname: "/tracks",
      },
      label: "Tracks",
    },
  ],
  [
    ROUTE.listen,
    {
      url: {
        pathname: "https://doyou.world/",
      },
      label: "Listen",
    },
  ],
]);

export const BANANA_NAV_LINKS = [
  ROUTES.get(ROUTE.listen),
  ROUTES.get(ROUTE.today),
  ROUTES.get(ROUTE.archive),
] as IRoute[];

export const NAV_BAR_LINKS = [
  ROUTES.get(ROUTE.today),
  ROUTES.get(ROUTE.archive),
] as IRoute[];
