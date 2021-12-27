export enum ROUTE_HREF {
  listen = "listen",
  home = "home",
  today = "today",
  archive = "archive",
  tracks = "tracks",
}

export interface IRoute {
  href: string;
  label: string;
}

export const ROUTES = new Map<ROUTE_HREF, IRoute>([
  [
    ROUTE_HREF.home,
    {
      href: "/",
      label: "Home",
    },
  ],
  [
    ROUTE_HREF.archive,
    {
      href: "/archive",
      label: "Archive",
    },
  ],
  [
    ROUTE_HREF.today,
    {
      href: "/tracks",
      label: "Today",
    },
  ],
  [
    ROUTE_HREF.tracks,
    {
      href: "/tracks",
      label: "Tracks",
    },
  ],
  [
    ROUTE_HREF.listen,
    {
      href: "https://doyou.world/",
      label: "Listen",
    },
  ],
]);

export const BANANA_NAV_LINKS = [
  ROUTES.get(ROUTE_HREF.listen),
  ROUTES.get(ROUTE_HREF.today),
  ROUTES.get(ROUTE_HREF.archive),
] as IRoute[];

export const NAV_BAR_LINKS = [
  ROUTES.get(ROUTE_HREF.today),
  ROUTES.get(ROUTE_HREF.archive),
] as IRoute[];
