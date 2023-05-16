/**
 * Internal dependencies
 */
import { hasBabelConfig }  from "../lib/util.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const eslintConfig = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	overrides: [
		{
			// Unit test files and their helpers only.
			files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
		},
	],
};

if ( ! hasBabelConfig() ) {
	eslintConfig.parserOptions = {
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@wordpress/babel-preset-default' ) ],
		},
	};
}

export default eslintConfig;
