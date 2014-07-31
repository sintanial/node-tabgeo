# Tabgeo

  Implementation faster geo location database in node js
  Database page [tabgeo.com](http://http://tabgeo.com/).

## Installation

```
$ npm install tabgeo
```

## Example

```js
var getCountryCode = require('tabgeo')('path/to/tabgeo.dat');
var code = getCountryCode('31.192.104.0');
console.log(code); // RU
```

# License

  MIT