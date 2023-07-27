import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {globSync} from "glob";
import chalk from "chalk";
import { EOL } from "node:os";

function getCLIRoot() {
    const currentFilePath = fileURLToPath(import.meta.url);
    return path.join(path.dirname(currentFilePath), '../..');
}

function getWordPressRoot() {
    // Either a theme or plugin with styles/blocks
    return process.cwd();
}

const fromProjectRoot = (fileName) => path.join(path.dirname(process.cwd()), fileName);
const fromConfigRoot = (fileName) => path.join(process.cwd(), 't29-wp/config', fileName);

function getRenderPropPaths() {
    // Get the blocks from the themes inc/blocks directory using a glob
    let renderPropPaths = [];
    const blocks = globSync(path.join(getWordPressRoot(), 'inc', 'blocks', '**', 'block.json'), {absolute: true});
    for (const block of blocks) {
        // Read and parse json file. See if the parsed object contains a "render" key
        const parsed = JSON.parse(fs.readFileSync(block, 'utf8'));

        if (parsed.hasOwnProperty('acf')) {
            // Get ACF block renderTemplate php file. This does not seem to use file: prefix
            const { renderTemplate } = parsed.acf;
            if (!renderTemplate) {
                console.log(chalk.yellow(`Missing renderTemplate for ${block}. ACF Block will not work without it.${EOL}`));
                continue;
            }
            const renderFile = path.join(
                path.dirname( block ),
                renderTemplate
            );
            renderPropPaths.push(renderFile);
        } else if (
            // Get dynamic block render php file
            parsed.hasOwnProperty('render') &&
            typeof parsed.render === 'string' &&
            parsed.render.startsWith('file:')
        ) {
            // Removes the `file:` prefix.
            const renderFile = path.join(
                path.dirname( block ),
                parsed.render.replace( 'file:', '' )
            );
            // If it does, get the value and add it to renderPropPaths array
            renderPropPaths.push(renderFile);
        }
    }
    return renderPropPaths;
}

function getWebpackEntryPoints() {
    // Get the blocks from the themes inc/blocks directory using a glob
    let entryPoints = {};
    const blockDirectory = path.join(getWordPressRoot(), 'inc', 'blocks') + path.sep;
    const blocks = globSync(path.join(blockDirectory, '**', 'block.json'), {absolute: true});
    for (const block of blocks) {
        // Get the js files from the block like editorScript
        const {editorScript, script, viewScript} = JSON.parse(fs.readFileSync(block, 'utf8'));
        [ editorScript, script, viewScript ]
            .flat()
            .filter( ( value ) => value && value.startsWith( 'file:' ) )
            .forEach( ( value ) => {
                const filepath = path.join(
                    path.dirname( block ),
                    value.replace( 'file:', '' )
                );

                const entryName = filepath
                    .replace( path.extname( filepath ), '' )
                    .replace( blockDirectory, '' )
                    .replace( /\\/g, '/' );

                entryPoints[entryName] = path.join(
                    path.dirname( block ),
                    value.replace( 'file:', '' )
                );
            })
    }

    // Get the t29-wp block in the package.json and get the "entry" key value
    const pkgFile = path.join(getWordPressRoot(), 'package.json');
    if (fs.existsSync(pkgFile)) {
        const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
        if (pkg.hasOwnProperty('t29-wp')) {
            const { entry } = pkg['t29-wp'];
            // if entry key is truthy and the object has keys
            if (entry && Object.keys(entry).length) {
                entryPoints = {...entryPoints, ...entry};
            }
        }
    }

    return entryPoints;
}
export {
    getCLIRoot,
    getWordPressRoot,
    getRenderPropPaths,
    getWebpackEntryPoints,
    fromProjectRoot,
    fromConfigRoot
}