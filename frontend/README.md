This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## SSG, SSR and ISR

Efforts have been made to prevent redundant calls to our tracks API e.g. for track list in the past which will never update.

### `pages/tracks/`

All pages get data server-side and provide as fallback/initial data data to `useSWR`. This means all days will be SSR'd.

Pages for days **before** the last build day fetch data once at build time and never again.

Pages for days **between** the last build day and the date of request will fetch date server-side at lest once on first request and then never again. Their HTML and JSON is effectively statically generated on this request and cached.

Pages for days **on** the date of request will fetch data server-side (60 debounce) using NextJS revalidation.

Pages for days **after** the date of request will not fetch data server-side, instead return a 404 to be revalidated in the future.

Only today's track list will also fetch data client side on mount and on focus (60 debounce).

Although NextJS fetch cached JSON other statically generated pages.

All other days rely solely on data fetched on the server or JSON cached by NextJS.

#### `pages/tracks/today.tsx`

`getStaticProps => revalidate: 60` will SSR track page for today at most every 60 seconds.

Also, `Tracks.tsx` only fetches new data client-side for today's track list. i.e. when date param is the same as request date.

#### `pages/tracks/[date].tsx`

`getStaticPaths` will generate tracks pages for all past days (as of build day).

These pages will always have correct data as track data for days in the past does not change. This data is available at build time and will never need to be updated.

Hence `getStaticProps` is set to `revalidate: false` i.e. no Incremental Static Revalidation.

Also, `Tracks.tsx` only fetches new data client-side for today's track list. i.e. no past days

#### `pages/tracks/[[...date]].tsx`

`getStaticPaths` paired with `[[...date]].tsx` catch all route and `getStaticProps => revalidate: true | false` will SSR tracks pages all future days.

When SSR'ing, if malformed params will return 404 and not revalidate.

When SSR'ing, if date in future of date of request, will return 404 but will revalidate as one day that future day will be in the past.

When SSR'ing, if date between the date of last build and before the date of request will fetch data server-side once, cache HTML and JSON and not revalidate.

## Fonts and FOUT

In order to prevent Flash Of Un-styled Text, font-faces declared in SCSS files also have their src `preloaded` in `_document` and `font-display: optional`. On slow connections and fallback will be shown if the font doesn't load in time and on the next navigation / refresh the correct font will be shown.

Stack overflow answer [here](https://stackoverflow.com/questions/60841540/flash-of-unstyled-text-fout-on-reload-using-next-js-and-styled-components/70435013#70435013).

## 11:11

- created hook to trigger mode

## Color scheme

- created hook to get color scheme from browser / OS
- light and dark schemes
- styling for each theme done at component level using colorScheme mixin
- sections of page can be set to 'dark' with `data-color-scheme="dark"` on a parent HTML element
