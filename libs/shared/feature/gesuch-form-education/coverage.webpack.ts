export const setupCoverageWebpack = (paths: string[]) => ({
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: paths,
        exclude: [/\.(cy|spec)\.ts$/, /node_modules/],
      },
    ],
  },
});
