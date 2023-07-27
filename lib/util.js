import {
    spawnScript
} from './util/command.js'

import {
    getWordPressRoot,
    getCLIRoot,
    getRenderPropPaths,
    getWebpackEntryPoints,
    fromProjectRoot,
    fromConfigRoot
} from './util/file.js'

import {
    hasBabelConfig,
    hasPrettierConfig,
    hasWebpackConfig,
    hasCssnanoConfig,
    hasPostCSSConfig,
    getCLIConfig,
} from "./util/config.js";

import {
    hasArgInCLI,
    getWebpackArgs,
    handleSignal,
} from "./util/cli.js"

export {
    // CLI
    hasArgInCLI,
    getWebpackArgs,
    handleSignal,
    // Command
    spawnScript,
    // File
    getWordPressRoot,
    getCLIRoot,
    getCLIConfig,
    getRenderPropPaths,
    getWebpackEntryPoints,
    //Config
    hasBabelConfig,
    hasPrettierConfig,
    hasWebpackConfig,
    hasCssnanoConfig,
    hasPostCSSConfig,
    fromProjectRoot,
    fromConfigRoot
}