import spawn from "cross-spawn";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import resolveBin from "resolve-bin";
import fs from "fs";

import {
  getWebpackArgs,
  hasArgInCLI,
  fromProjectRoot,
  fromConfigRoot,
} from "../lib/util.js";

const EXIT_ERROR_CODE = 1;

const webpackArgs = getWebpackArgs();
let configPath = fromConfigRoot("webpack.config.js");

const arg_hot = hasArgInCLI("--hot");

if (arg_hot) {
  webpackArgs.unshift("serve");
} else if (!hasArgInCLI("--no-watch")) {
  webpackArgs.unshift("watch");
}

const displayWebpackStats = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  process.stdout.write(`${stats.toString({ colors: true })}\n`);
};

const runWebpack = async () => {
  // Import webpack config wihout using require
  const configPromise = await import(configPath);
  const config = configPromise.default;
  const compiler = webpack(config);
  const { devServer } = config;

  if (devServer) {
    const devServerOptions = { ...devServer, host: "127.0.0.1", open: false };
    const server = new WebpackDevServer(devServerOptions, compiler);

    server.start();
  } else {
    compiler.watch(
      {
        aggregateTimeout: 600,
      },
      (err, stats) => {
        displayWebpackStats(err, stats);
      }
    );
  }
};

if (arg_hot) {
  process.on("SIGINT", () => {
    // when gracefully leaving hot mode, clean up dist folder.
    // this avoids leaving js code with the fast refresh instrumentation and thus reducing confusion
    console.log("\nt29-wp: Cleaning up build folder...");

    fs.rmSync(fromProjectRoot("tmp"), {
      recursive: true,
      force: true,
    });
  });
  // compile the fast refresh bundle
  const configPromise = await import(
    fromConfigRoot("webpack-fast-refresh.config.js")
  );
  const config = configPromise.default;
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    displayWebpackStats(err, stats);

    compiler.close((closedErr) => {
      if (closedErr) {
        // eslint-disable-next-line no-console
        console.error(closedErr);
      } else {
        // we can only call runWebpack after the compiler has closed
        runWebpack();
      }
    });
  });
} else {
  await runWebpack();
}
