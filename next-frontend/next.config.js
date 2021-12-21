/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    loader: "cloudinary",
    path: "https://res.cloudinary.com/dmqr7syhe/",
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
};
