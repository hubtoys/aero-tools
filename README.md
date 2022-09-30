# aero-tools

[![npm version](https://img.shields.io/npm/v/aero-tools.svg?style=flat-square)](https://www.npmjs.org/package/aero-tools)

Some usefull functions to perform aeronautical computations

## Installing

Using npm:

```bash
$ npm install aero-tools
```

Using bower:

```bash
$ bower install aero-tools
```

Using yarn:

```bash
$ yarn add aero-tools
```

Using pnpm:

```bash
$ pnpm add aero-tools
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/aero-tools/dist/aero-tools.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/aero-tools/dist/aero-tools.min.js"></script>
```

## Example

### note: CommonJS usage

In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with `require()` use the following approach:

```js
const { destinationPoint } = require("aero-tools");
```

Search for a destination point, given a start position, distance & bearing

```js
console.log(
  destinationPoint(53.1538889, 1.7297222222222224, "096°01′19″", 2000)
);
```

## Available functions

##### aero-tools#deg2Rad

##### aero-tools#deg2Dms,

##### aero-tools#bearing,

##### aero-tools#meters2Miles,

##### aero-tools#meters2NauticMiles,

##### aero-tools#distance,

##### aero-tools#destinationPoint,

##### aero-tools#rangeMap,

## License

[MIT](LICENSE)
