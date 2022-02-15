const fs = require("fs");
const path = require("path");

// Webpack
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

// Runtime and dev deps
const dayjs = require("dayjs");

// Build info
const packageJson = require(path.resolve(__dirname, "package"));
const appName = packageJson.name;
const appAuthor = packageJson.author || process.env.AUTHOR || "Unknown";
const version = packageJson.version;
const buildTime = dayjs().format("MMMM DD YYYY, h:mm:ss a");
const buildTimeBuster = dayjs().format("YYYYMMDD_HHmmss");

// Webpack server
const isDevServer = process.env.WEBPACK_SERVE;
const useAnalyzer = process.env.USE_ANALYZER;
const enableSRI = false; // TODO: consult with integration teams about SRI

// Superset of the webpack entry configuration to associate titles
// and possibly other information to the entry points
const entryDetails = [
  {
    title: "Parametric Geometry Using ThreeJS - Index",
    name: "index",
    model: "./src/index.ts",
    template: "./src/index.ejs",
    filename: "./index.html",
    chunks: ["index"],
    inject: false,
  },
  {
    title: "Parametric Geometry Using ThreeJS - Example 1",
    name: "example-1",
    model: "./src/example-1.ts",
    template: "./src/example-1.ejs",
    filename: "./example-1.html",
    chunks: ["example-1"],
    inject: false,
  },
  {
    title: "Parametric Geometry Using ThreeJS - Example 2",
    name: "example-2",
    model: "./src/example-2.ts",
    template: "./src/example-2.ejs",
    filename: "./example-2.html",
    chunks: ["example-2"],
    inject: false,
  },
];

let baseConfig = {
  // You could manually configure entries if necessary, starting with the following,
  // but generally it is too tedious to manually set all of the necessary properties.
  // entry: {
  //   index: path.resolve(__dirname, "./src/index.ts"),
  // },
  entry: createEntries(entryDetails),

  // cheap-module-eval-source-map is the prescribed setting for development;
  // however, inline-source-map is the prescribed setting for TS source maps
  // REFERENCE: https://webpack.js.org/guides/typescript/#source-maps
  devtool: isDevServer ? "inline-source-map" : false,

  devServer: {
    static: [
      {
        directory: path.join(__dirname, "dist/umd"),
      },
      {
        directory: path.join(__dirname, "dist"),
      },
      {
        directory: path.join(__dirname, "assets"),
      },
      {
        directory: path.join(__dirname, "tests/manual"),
      },
      {
        directory: path.join(__dirname, "src"),
      },
    ],
    compress: true,
    port: 9081,
    open: true,
    open: ["./index.html"],
    historyApiFallback: true,
    allowedHosts: "all",
    host: "localhost.zapdaz.com",
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/localhost.zapdaz.com.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.zapdaz.com.crt")),
    },
  },
  watchOptions: {
    ignored: ["node_modules/**"],
  },

  module: {
    rules: [
      // Bake the version and build info into the stream before transpiling
      {
        test: /build-info.tsx?$/,
        loader: "string-replace-loader",
        options: {
          multiple: [
            // name from package.json
            { search: "${appName}", replace: appName },
            // name from package.json
            { search: "${appAuthor}", replace: appAuthor },
            // version from package.json
            { search: "${version}", replace: version },
            // human-friendly date and time of build
            { search: "${buildTime}", replace: buildTime },
            // cache-busting-friendly date and time of build
            { search: "${buildTimeBuster}", replace: buildTimeBuster },
          ],
        },
      },
      {
        test: /app.config.json?$/,
        loader: "string-replace-loader",
        options: {
          multiple: [{ search: '"release": "dev"', replace: `"release": "${process.env.RELEASE_BRANCH}"` }],
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: require.resolve("ts-loader"),
        exclude: /node_modules/,
        options: PnpWebpackPlugin.tsLoaderOptions({
          // webpack-dev-server hangs when tsconfig.json `declarations: true is set
          // So, let's use an extended version of tsconfig for dev that sets it to false
          configFile: isDevServer ? "tsconfig.serve.json" : "tsconfig.json",
        }),
      },

      // Favoring the inline syntax within entryDetails
      {
        test: /\.ejs$/,
        use: {
          loader: "ejs-compiled-loader",
          options: {},
          // build crashes if options is not defined; however,
          // the effective options are defined in HTMLWebpackConfig
          // options: {
          //   htmlmin: true,
          //   htmlminOptions: {
          //     removeComments: true,
          //   },
          // },
        },
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },

  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },

  plugins: [
    new ESLintPlugin({
      extensions: ["ts", "tsx"],
      exclude: ["/node_modules/"],
      fix: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/favicon.ico", to: "favicon.ico" },
        {
          from: "src/app.config.json",
          to: "app.config.json",
          transform(content) {
            let revisedContent = content.toString("utf8").replace("local", "remote");
            revisedContent = revisedContent.replace(
              '"release": "${releaseBranch}"',
              '"release": "' + process.env.RELEASE_BRANCH + '"',
            );
            return Promise.resolve(Buffer.from(revisedContent.toString(), "utf8"));
          },
        },
      ],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        // REFERENCE:
        // NOTE: We want a single file build of the module.  So for the most part, chunk
        // optimization are removed. Comment this to keep vendors in each chunk
        vendors: {
          chunks: "initial",
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
        },

        // NOTE: top-level entry points cannot be split without affecting html-webpack-plugin's injections.
        // This is due to a bug in the dev stack. This syntax used to work.
        // example: {
        //   test: new RegExp("example.*"),
        //   chunks: "all",
        //   name: "example",
        //   enforce: true,
        // },

        // NOTE: If we wanted to split the module into multiple files, this is how.  We don't.  Single file is ideal.
        // myModule: {
        //   test: new RegExp("myModule.*"),
        //   chunks: "all",
        //   name: "myModule",
        //   enforce: true,
        // },
      },
    },
  },

  output: {
    library: ["zapdaz", "CoreModule"],
    libraryTarget: "umd",
    filename: `[name]_v${version}_b${buildTimeBuster}.js`,
    path: path.resolve(__dirname, "dist/umd/"),
    umdNamedDefine: true,
    clean: true,
    crossOriginLoading: "anonymous", // Required for SRI to work
  },
};

// Webpack will invoke the exported function with two arguments.
// The environment and an options map.  The latter describes options
// passed to webpack, such as --mode, --output-path, etc.
module.exports = (env, { mode }) => {
  return updateConfig(baseConfig, env, mode);
};

/**
 * Create a standard webpack entry configuration.
 * @param {Array} entryDetails like webpack's entry config, but with additional non-standard properties
 */
function createEntries(entryDetails) {
  let entryConfig = {};
  entryDetails.forEach((entryItem) => {
    if (entryConfig.hasOwnProperty(entryItem.name)) {
      console.warn(
        `WARN: ⚠️  Duplicate entry names are not allowed.  Only the first "${entryItem.name}" entry will be processed.`,
      );
    } else {
      entryConfig[entryItem.name] = path.resolve(__dirname, entryItem.model);
    }
  });

  return entryConfig;
}

/**
 * Configures the HtmlWebpackPlugin for multiple entry points (pages)
 * The result is multiple HTML documents based on the `entry` config
 * and `entryDetails`
 * @param {Object} config the webpack entry config
 * @param {Object} env Node process.env
 * @param {String} mode development|production|test
 */
function updateConfig(config, env, mode) {
  // Separates the webpack runtime from chunks.
  // Do not use when creating single-file UMD libraries.
  // Only use when running local webpack dev server.
  if (isDevServer && (process.env.RELEASE_BRANCH === "proto" || process.env.RELEASE_BRANCH === "dev"))
    config.optimization.runtimeChunk = { name: "runtime" };

  // Switching from 'env' to 'process.env' so the following hack is no longer needed.
  // Add a new string-replace-loader rule to replace the releaseBranch with the webpack --env setting
  // because 'env' is not available till updateConfig is called.
  let replaceRule = config.module.rules.find((rule) => rule.loader === "string-replace-loader");
  replaceRule.options.multiple.push({ search: "${releaseBranch}", replace: process.env.RELEASE_BRANCH });

  for (entryName in config.entry) {
    // Correlate our non-standard details to the entry names
    let entryDetail = entryDetails.find((entryItem) => entryItem.name === entryName);
    config.plugins.unshift(new HtmlWebpackPlugin(createHtmlWebpackConfig(env, mode, entryDetail)));
  }

  // Note that even when we specify to enableSRI, it is only used build or serve mode is "production"
  if (enableSRI) config.plugins.push(new SubresourceIntegrityPlugin());

  if (!isDevServer && useAnalyzer) config.plugins.push(new BundleAnalyzerPlugin());

  return config;
}

/**
 * Create a HtmlWebpackPlugin object
 */
function createHtmlWebpackConfig(env, mode, entryDetail) {
  let htmlWebpackConfig = {};
  htmlWebpackConfig.meta = {
    viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
  };

  if (entryDetail.title) htmlWebpackConfig.title = entryDetail.title;
  if (entryDetail.template) htmlWebpackConfig.template = entryDetail.template;
  if (entryDetail.filename) htmlWebpackConfig.filename = entryDetail.filename;
  if (entryDetail.inject === true || entryDetail.inject === false) htmlWebpackConfig.inject = entryDetail.inject;
  if (entryDetail.chunks) htmlWebpackConfig.chunks = entryDetail.chunks;

  htmlWebpackConfig.appName = appName;
  htmlWebpackConfig.author = process.env && process.env.AUTHOR ? process.env.AUTHOR : "Unknown";
  htmlWebpackConfig.version = version;
  htmlWebpackConfig.buildTime = buildTime;
  htmlWebpackConfig.releaseBranch = process.env && process.env.RELEASE_BRANCH ? process.env.RELEASE_BRANCH : "dev";
  htmlWebpackConfig.storageKey = entryDetail.name.replace("/", "_");
  htmlWebpackConfig.mode = mode;
  htmlWebpackConfig.minify = {
    collapseWhitespace: false,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  };

  return htmlWebpackConfig;
}

// ----------------------------------------------------------------------------
// Notes
// Example HTMLWebpackConfig
// let htmlWebpackConfig = {
//   templateParameters: (compilation, assets, assetTags, options) => {
//     return {
//       compilation,
//       webpackConfig: compilation.options,
//       htmlWebpackPlugin: {
//         tags: assetTags,
//         files: assets,
//         options,
//       },
//       title: "Parametric Geometry",
//       appName: appName,
//       version: version,
//       appAuthor: appAuthor,
//       buildTime: buildTime,
//       buildTimeBuster: buildTimeBuster,
//     };
//   },
//   filename: "example-1.html",
//   template: "src/example-1.ejs",
//   inject: false,
//   chunks: ["example-1"],
//   minify: {
//     collapseWhitespace: false,
//     removeComments: true,
//     removeRedundantAttributes: true,
//     removeScriptTypeAttributes: true,
//     removeStyleLinkTypeAttributes: true,
//     useShortDoctype: true,
//   },
// }
// ============================================================================
