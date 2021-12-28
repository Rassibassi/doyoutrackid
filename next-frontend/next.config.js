// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    loader: "cloudinary",
    path: "https://res.cloudinary.com/dmqr7syhe/",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            typescript: true,
            svgProps: { fill: "currentColor" },
          },
        },
      ],
    });
    return config;
  },
});
