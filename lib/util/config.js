import fs from 'node:fs';
import path from 'node:path';
import {
    getWordPressRoot,
    getCLIRoot,
} from "./file.js";
import {hasArgInCLI} from "./cli.js";

const getCLIConfig = config =>
    path.join(getCLIRoot(), 'config', config)

const getProjectFile = file =>
    path.join( getWordPressRoot(), file );

const hasProjectFile = file =>
    fs.existsSync(getProjectFile(file));

const hasPackageProp = (prop) => {
    // Check if package.json exists in the project root
    const packageJsonPath = path.join(getWordPressRoot(), 'package.json' );
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8')
        );
        return pkg.hasOwnProperty(prop)
    }

    return false;
}

// See https://babeljs.io/docs/en/config-files#configuration-file-types.
const hasBabelConfig = () =>
    hasProjectFile( '.babelrc.js' ) ||
    hasProjectFile( '.babelrc.json' ) ||
    hasProjectFile( 'babel.config.js' ) ||
    hasProjectFile( 'babel.config.json' ) ||
    hasProjectFile( '.babelrc' ) ||
    hasPackageProp( 'babel' );

// See https://cssnano.co/docs/config-file.
const hasCssnanoConfig = () =>
    hasProjectFile( '.cssnanorc' ) ||
    hasProjectFile( '.cssnanorc.js' ) ||
    hasProjectFile( '.cssnanorc.json' ) ||
    hasProjectFile( '.cssnanorc.yaml' ) ||
    hasProjectFile( '.cssnanorc.yml' ) ||
    hasProjectFile( 'cssnano.config.js' ) ||
    hasPackageProp( 'cssnano' );


// See https://prettier.io/docs/en/configuration.html.
const hasPrettierConfig = () =>
    hasProjectFile( '.prettierrc.js' ) ||
    hasProjectFile( '.prettierrc.json' ) ||
    hasProjectFile( '.prettierrc.toml' ) ||
    hasProjectFile( '.prettierrc.yaml' ) ||
    hasProjectFile( '.prettierrc.yml' ) ||
    hasProjectFile( 'prettier.config.js' ) ||
    hasProjectFile( '.prettierrc' ) ||
    hasPackageProp( 'prettier' );

const hasWebpackConfig = () =>
    hasArgInCLI( '--config' ) ||
    hasProjectFile( 'webpack.config.js' ) ||
    hasProjectFile( 'webpack.config.babel.js' );

// See https://github.com/michael-ciniawsky/postcss-load-config#usage (used by postcss-loader).
const hasPostCSSConfig = () =>
    hasProjectFile( 'postcss.config.js' ) ||
    hasProjectFile( '.postcssrc' ) ||
    hasProjectFile( '.postcssrc.json' ) ||
    hasProjectFile( '.postcssrc.yaml' ) ||
    hasProjectFile( '.postcssrc.yml' ) ||
    hasProjectFile( '.postcssrc.js' ) ||
    hasPackageProp( 'postcss' );

export {
    getCLIConfig,
    hasBabelConfig,
    hasPrettierConfig,
    hasWebpackConfig,
    hasCssnanoConfig,
    hasPostCSSConfig
}