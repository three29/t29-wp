import {getCLIConfig, hasWebpackConfig} from "../util.js";

const getArgsFromCLI = ( excludePrefixes ) => {
    const args = process.argv.slice( 2 );
    if ( excludePrefixes ) {
        return args.filter( ( arg ) => {
            return ! excludePrefixes.some( ( prefix ) =>
                arg.startsWith( prefix )
            );
        } );
    }
    return args;
};

const getArgFromCLI = ( arg ) => {
    for ( const cliArg of getArgsFromCLI() ) {
        const [ name, value ] = cliArg.split( '=' );
        if ( name === arg ) {
            return value || null;
        }
    }
};

const hasArgInCLI = ( arg ) => getArgFromCLI( arg ) !== undefined;

const getWebpackArgs = () => {
    // Gets all args from CLI without those prefixed with `--webpack`.
    // All custom options supported by `t29-wp` are prefixed with --webpack
    let webpackArgs = getArgsFromCLI( [ '--webpack' ] );

    // If the webpack config has not been overwritten include the default one
    if ( ! hasWebpackConfig() ) {
        webpackArgs.push( '--config', getCLIConfig( 'webpack.config.js' ) );
    }

    return webpackArgs;
}

const handleSignal = ( signal ) => {
    if ( signal === 'SIGKILL' ) {
        // eslint-disable-next-line no-console
        console.log(
            'The script failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
    } else if ( signal === 'SIGTERM' ) {
        // eslint-disable-next-line no-console
        console.log(
            'The script failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
    }
    process.exit( 1 );
}

export {
    getArgsFromCLI,
    getArgFromCLI,
    hasArgInCLI,
    getWebpackArgs,
    handleSignal
}