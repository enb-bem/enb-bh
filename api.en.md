# Technologies API

The package includes the following technologies:

* For building BH templates:
  * [bh-bundle](#bh-bundle)
  * [bh-commonjs](#bh-commonjs)
* For generating HTML:
  * [bemjson-to-html](#bemjson-to-html)

## bh-bundle

Collects `bh.js` block and core files in a single file – the `?. bh.js` bundle, which is used both for working in a browser and in Node.js. After compiling, it does not require connecting the template source files.

It has support for the [YModules](https://github.com/ymaps/modules/blob/master/README.md) modular system and partial support for [CommonJS](http://www.commonjs.org/), since `require`  will not work correctly in `bh.js` files.

If the executable environment doesn't have any modular systems, the module will be provided to the `BH` global variable.

### Options

Options are specified in the configuration file (.enb/make.js).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [bhFilename](#bhfilename)
* [sourcemap](#sourcemap)
* [requires](#requires)
* [mimic](#mimic)
* [scope](#scope)
* [bhOptions](#bhoptions)

### target

Type: `String`. Default: `?.bh.js`.

The name of the compiled file for saving the build result with the necessary `bh.js` project files.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The list of files is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['bh.js']`.

The file suffixes to use for filtering BH template files for the build.

#### bhFilename

Type: `String`. Default: `require.resolve('bh/lib/bh.js')`.

Path to the file with the BH engine.

Use this option if you need a non-standard version of the [BH template engine](https://en.bem.info/technology/bh/).

**Important!** The [bh-bundle](#bh-bundle) technology is only guaranteed to work correctly with the BH template engine version `4.1.0`

#### sourcemap

Type: `Boolean`. Default: `false`.

Creates source maps with information about the source files. The maps are included in a compiled file called `? .files` – they are not stored in separate files with a `.map` extension.

#### requires

Type: `Object`. Default: `{}`.

Specifies the names or paths to connect external libraries to the ` bh.lib` namespace – ` bh.lib.name`.

> For information on how it works, see the section [Connecting third-party libraries](README.md).

#### mimic

Type: `String | String[]`. Default: `['bh']`.

Specifies the names of the new variables.

> For information on how it works, see the section [BEMHTML Mimicry](README.md).

#### scope

Type: `String`. Default: `template`.

Specifies the scope of the source code for the templates.

Possible values:

* `template` – Isolates template execution.
* `global` – Enables you to execute templates in a shared scope.

#### bhOptions

Type: `Object`. Default: `{}`.

Configures the BH template engine using the passed options.

> Possible options are described in the [template engine documentation](https://github.com/bem/bh/blob/master/README.md#setting-up).

**Example**

```js
var BHBundleTech = require('enb-bh/techs/bh-bundle'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

 module.exports = function(config) {
     config.node('bundle', function(node) {
         // Getting the FileList
         node.addTechs([
             [FileProvideTech, { target: '?.bemdecl.js' }],
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Creating a BH file
         node.addTech(BHBundleTech);
         node.addTarget('?.bh.js');
     });
 };
```

## bh-commonjs

Collects `bh.js` block files in a single file – the `?.bh.js` bundle, which is used both for working in Node.js. After the build, all the source files that are connected using `require` must be present.

The dependencies are added to the templates using `require`. The paths are processed relative to the file that specifies `require`.

The result of the build is a `bh.js` file that connects the necessary `bh.js` source files and the core file from `node_modules`.

### Options

Options are specified in the configuration file (.enb/make.js).

* [target](#target-1)
* [filesTarget](#filestarget-1)
* [sourceSuffixes](#sourcesuffixes-1)
* [bhFilename](#bhfilename-1)
* [devMode](#devmode)
* [mimic](#mimic)
* [bhOptions](#bhoptions-1)

#### target

Type: `String`. Default: `?.bh.js`.

The name of the target file for saving the build result of the necessary project `bh.js` files – the compiled `?.bh.js` file.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The file list is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['bh.js']`.

The file suffixes to use for filtering BH template files for the build.

#### bhFilename

Type: `String`. Default: `require.resolve('bh/lib/bh.js')`.

Path to the file with the BH engine.

Use this option if you need a non-standard version of the [BH template engine](https://en.bem.info/technology/bh/).

**Important!** The [bh-commonjs](#bh-commonjs) technology is only guaranteed to work correctly with the BH template engine version `4.1.0` and later.

#### devMode

Type: `Boolean`. Default: `true`.

Build mode in which each new connection of the build file initiates a reset of the`require` cache for all internal files. This allows you to see changes in templates without restarting Node.js.

#### mimic

Type: `String | Array`. Default: `['bh']`.

Specifies the names of the new variables.

> For information on how it works, see the section [BEMHTML Mimicry](README.md).

#### bhOptions

Type: `Object`. Default: `{}`.

Configures the BH template engine using the passed options.

> Possible options are described in the [template engine documentation](https://github.com/bem/bh/blob/master/README.md#setting-up).

**Example**

```js
var BHCommonJSTech = require('enb-bh/techs/bh-commonjs'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the FileList
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Building the BH file
        node.addTech(BHCommonJSTech);
        node.addTarget('?.bh.js');
    });
};
```

## bemjson-to-html

Intended for building an HTML file. Processes [BEMJSON](https://en.bem.info/platform/bemjson/) and a compiled `?.bh.js` file (resulting from [bh-bundle](#bh-bundle) or [bh-commonjs](#bh-commonjs) technologies) in order to get HTML.

### Options

Options are specified in the configuration file (.enb/make.js).

* [bhFile](#bhfile)
* [bemjsonFile](#bemjsonfile)
* [target](#target-2)

#### bhFile

Type: `String`. Default: `?.bh.js`.

The name of the file that contains the template that was compiled using one of the technologies ([bh-bundle](#bh-bundle) or [bh-commonjs](#bh-commonjs)). Used for converting BEMJSON to HTML.

#### bemjsonFile

Type: `String`. Default: `?.bemjson.js`.

The name of the BEMJSON file to apply the compiled `?.bh.js` template to (resulting from [bh-bundle](#bh-bundle) or [bh-commonjs](#bh-commonjs) technologies) in order to get HTML.

#### target

Type: `String`. Default: `?.html`.

The HTML file is the result of applying the compiled template to the specified BEMJSON file.

**Example**

```js
var BemjsonToHtmlTech = require('enb-bh/techs/bemjson-to-html'),
    BHCommonJSTech = require('enb-bh/techs/bh-commonjs'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the BEMJSON file
        node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);

        // Getting the FileList
        node.addTechs([
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.bemjsonToBemdecl],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Building the BH file
        node.addTech(BHCommonJSTech);
        node.addTarget('?.bh.js');

        // Creating the HTML file
        node.addTech(BemjsonToHtmlTech);
        node.addTarget('?.html');
    });
};
```
