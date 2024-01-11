# t29-wp

This is a package that provides asset compilation for WordPress themes that follow the Three29 naming conventions. This
is heavily inspired from `wp-scripts` and `react-scripts`.

## Installation
Run the following command to install:
`npm install --save-dev t29-wp`

## Available Scripts
#### Build
Run `t29-wp build` to compile assets for production.
```
// Example section from package.json
"scripts": {
    "build": "t29-wp build",
  },
```

#### Start
Run `t29-wp start` to compile for development and watch assets for changes.
```
// Example section from package.json
"scripts": {
    "watch": "t29-wp start",
  },
```
##### Optional Arguments
###### `--hot`
Adds the `serve` argument to the beginning of the command passed to webpack.

###### `--no-watch`
Removes the `watch` argument to the beginning of the command passed to webpack.
