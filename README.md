# Tabgeo

  Implementation faster geo location database in node js
  
  Database page [tabgeo.com](http://tabgeo.com/).

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

## Sync tabgeo db
```bash
tabgeo-sync [-path] path/to/file/save [--force]

Options:
    -path   Path to save file.
    --force Force update file, without check file hash sum and actually db sum.
    
Example:
// Download file, if not exists. 
// If file exists, check hash file and actually sum, and if does not match, then replace current file with new db
tabgeo-sync -path ./tabgeo.dat

// same
tabgeo-sync ./tabgeo.dat

// Force update, without checking the actually
tabgeo-sync ./tabgeo.dat --force
```
# License

  MIT