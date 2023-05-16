import spawn from 'cross-spawn';
import resolveBin from 'resolve-bin';
import {getWebpackArgs} from '../lib/util.js'

const EXIT_ERROR_CODE = 1;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { status } = spawn.sync( resolveBin.sync( 'webpack' ), getWebpackArgs(), {
    stdio: 'inherit',
} );

process.exit( status === null ? EXIT_ERROR_CODE : status );
