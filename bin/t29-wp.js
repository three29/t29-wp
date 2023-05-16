#!/usr/bin/env node

import {spawnScript} from "../lib/util.js";

const args = process.argv.slice(2);
import chalk from 'chalk';
import os from "node:os";

if (!args.length) {
    console.log(chalk.yellow('Missing Command'));
    console.log(
        "Usage: t29-wp <command>" + os.EOL + os.EOL,
        "\tbuild - Compiles assets for production" + os.EOL,
        "\twatch - Compiles assets for development and starts a file watcher." + os.EOL,
    )
    process.exit(-1);
}


const [command, ...opts] = args;

spawnScript(command, opts);
