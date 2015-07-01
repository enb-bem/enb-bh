var coreFilename = require.resolve('bh/lib/bh.js'),
    EOL = require('os').EOL;

/**
 * @class BHCommonJSTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Compile CommonJS module of BH with requires of core and source templates (bh.js files).<br/><br/>
 *
 * Use to apply in server side only (Node.js). You can use `require` in templates.<br/><br/>
 *
 * Important: for correct apply the source files and files are specified in `requires` should be in file system.
 *
 * @param {Object}      [options]                           Options
 * @param {String}      [options.target='?.bh.js']          Path to target with compiled file.
 * @param {String}      [options.filesTarget='?.files']     Path to target with FileList.
 * @param {String[]}    [options.sourceSuffixes='bh.js']    Files with specified suffixes involved in the assembly.
 * @param {String[]}    [options.mimic]                     Names to export.
 * @param {Boolean}     [options.devMode=true]              Drop cache for `require` of source templates.
 * @param {String}      [options.jsAttrName='data-bem']     Set `jsAttrName` option for BH core.
 * @param {String}      [options.jsAttrScheme='json']       Set `jsAttrScheme` option for BH core.
 * @param {String}      [options.jsCls='i-bem']             Set `jsCls` option for BH core.
 * @param {Boolean}     [options.jsElem=true]               Set `jsElem` option for BH core.
 * @param {Boolean}     [options.escapeContent=false]       Set `escapeContent` option for BH core.
 * @param {Boolean}     [options.clsNobaseMods=false]       Set `clsNobaseMods` option for BH core.
 *
 * @example
 * var BHCommonJSTech = require('enb-bh/techs/bh-commonjs'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bem.levels, levels: ['blocks']],
 *             bem.deps,
 *             bem.files
 *         ]);
 *
 *         // build BH file
 *         node.addTech(BHCommonJSTech);
 *         node.addTarget('?.bh.js');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('bh-commonjs')
    .target('target', '?.bh.js')
    .defineOption('mimic', [])
    .defineOption('devMode', true)
    .defineOption('jsAttrName', 'data-bem')
    .defineOption('jsAttrScheme', 'json')
    .defineOption('jsCls', 'i-bem')
    .defineOption('jsElem', true)
    .defineOption('escapeContent', false)
    .defineOption('clsNobaseMods', false)
    .useFileList(['bh.js'])
    .builder(function (bhFiles) {
        return this._compile(bhFiles);
    })
    .methods(/** @lends BHBundleTech.prototype */{

        /**
         * Creates code of dropRequireCache function.
         *
         * @protected
         * @returns {String} generated code of dropRequireCache function
         */
        _generateDropRequireCacheFunc: function () {
            return [
                'function dropRequireCache(requireFunc, filename) {',
                '    var module = requireFunc.cache[filename];',
                '    if (module) {',
                '        if (module.parent) {',
                '            if (module.parent.children) {',
                '                var moduleIndex = module.parent.children.indexOf(module);',
                '                if (moduleIndex !== -1) {',
                '                    module.parent.children.splice(moduleIndex, 1);',
                '                }',
                '            }',
                '            delete module.parent;',
                '        }',
                '        delete module.children;',
                '        delete requireFunc.cache[filename];',
                '    }',
                '};'
            ].join(EOL);
        },

        /**
         * Compile code for `require` module.
         * In dev mode will be added code for drop cache of require.
         *
         * @param {String} varname - variable name to get module
         * @param {String} filename - absolute path to module
         * @param {Boolean} devMode - development mode flag
         */
        _compileRequire: function (varname, filename, devMode) {
            var relPath = this.node.relativePath(filename);

            // Replace slashes with backslashes for windows paths for correct require work.
            /* istanbul ignore if */
            if (relPath.indexOf('\\') !== -1) {
                relPath = relPath.replace(/\\/g, '/');
            }

            return [
                devMode ? 'dropRequireCache(require, require.resolve("' + relPath + '"));' : '',
                (varname ? 'var ' + varname + '= ' : '') + 'require("' + relPath + '")' + (varname ? '' : '(bh)') + ';'
            ].join(EOL);
        },

        /**
         * Compile code of bh module with core and source templates.
         *
         * @protected
         * @param {Array.<{path: String, contents: String}>} sources - Files with source templates.
         * @returns {String} compiled code of bh module
         */
        _compile: function (bhFiles) {
            var devMode = this._devMode,
                mimic = [].concat(this._mimic);

            return [
                devMode ? this._generateDropRequireCacheFunc() : '',
                this._compileRequire('BH', coreFilename, devMode),
                'var bh = new BH();',
                'bh.setOptions({',
                '   jsAttrName: \'' + this._jsAttrName + '\',',
                '   jsAttrScheme: \'' + this._jsAttrScheme + '\',',
                '   jsCls: ' + (this._jsCls ? ('\'' + this._jsCls + '\'') : false) + ',',
                '   jsElem: ' + this._jsElem + ',',
                '   escapeContent: ' + this._escapeContent + ',',
                '   clsNobaseMods: ' + this._clsNobaseMods,
                '});',
                '',
                bhFiles.map(function (file) {
                    return this._compileRequire(null, file.fullname, devMode);
                }, this).join(EOL),
                '',
                'module.exports = bh;',
                mimic.length ? mimic.map(function (name) {
                    return 'bh[\'' + name + '\'] = bh;';
                }).join(EOL) : ''
            ].join(EOL);
        }
    })
    .createTech();
