import spawn from 'cross-spawn';
import resolveBin from 'resolve-bin';
import {getWebpackArgs, hasArgInCLI,} from '../lib/util.js'

const EXIT_ERROR_CODE = 1;

const webpackArgs = getWebpackArgs();
if ( hasArgInCLI( '--hot' ) ) {
    webpackArgs.unshift( 'serve' );
} else if ( ! hasArgInCLI( '--no-watch' ) ) {
    webpackArgs.unshift( 'watch' );
}

const { status } = spawn.sync( resolveBin.sync( 'webpack' ), webpackArgs, {
    stdio: 'inherit',
} );

process.exit( status === null ? EXIT_ERROR_CODE : status );