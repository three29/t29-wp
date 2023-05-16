import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import spawn from 'cross-spawn';
import chalk from 'chalk';
import {handleSignal} from "./cli.js";

function getScript(name) {
    const currentFilePath = fileURLToPath(import.meta.url);
    return path.join( path.dirname(currentFilePath), '../../scripts', `${name}.js` );
}
const spawnScript = (script, args = [], nodeArgs = [] ) => {
    if (!script) {
        console.log(chalk.yellow('Missing Script Name'));
        process.exit(-1);
    }

    const scriptPath = getScript(script);
    if (!fs.existsSync(scriptPath)) {
        console.log(chalk.yellow(`Cannot find script '${script}'`));
        console.log(scriptPath);
        process.exit(-1);
    }

    const { signal, status } = spawn.sync(
        'node',
        [ ...nodeArgs, scriptPath, ...args ],
        {
            stdio: 'inherit',
        }
    );

    if ( signal ) {
        handleSignal( signal );
    }

    process.exit( status );
}


export {
    spawnScript
}