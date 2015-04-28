/**
 * bh-server
 * =========
 *
 * Склеивает *bh*-файлы по deps'ам с помощью набора `require` в виде `?.bh.js`.
 * Предназначен для сборки серверного BH-кода. После сборки требуется наличие всех файлов,
 * подключённых с помощью набора `require`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bh.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — ['bh.js'].
 * * *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
 * * *String* **jsAttrScheme** — Cхема данных для параметров инициализации. По умолчанию — `js`.
 * *                             Форматы:
 * *                                `js` — значение по умолчанию. Получаем `return { ... }`.
 * *                                `json` — JSON-формат. Получаем `{ ... }`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-bh/techs/bh-server'));
 * ```
 */

var path = require('path');

module.exports = require('enb/lib/build-flow').create()
    .name('bh-server')
    .target('target', '?.bh.js')
    .defineOption('bhFile', '')
    .defineOption('jsAttrName', 'onclick')
    .defineOption('jsAttrScheme', 'js')
    .useFileList(['bh.js'])
    .needRebuild(function (cache) {
        this._bhFile = this._bhFile ? path.join(this.node._root, this._bhFile) : require.resolve('bh/lib/bh.js');

        return cache.needRebuildFile('bh-file', this._bhFile);
    })
    .saveCache(function (cache) {
        cache.cacheFileInfo('bh-file', this._bhFile);
    })
    .builder(function (bhFiles) {
        var node = this.node;
        /**
         * Генерирует `require`-строку для подключения исходных bh-файлов.
         *
         * @param {String} absPath
         * @param {String} pre
         * @param {String} post
         */
        function buildRequire(absPath, pre, post) {
            var relPath = node.relativePath(absPath);

            return [
                'dropRequireCache(require, require.resolve("' + relPath + '"));',
                (pre || '') + 'require("' + relPath + '")' + (post || '') + ';'
            ].join('\n');
        }

        var dropRequireCacheFunc = [
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
        ].join('\n');

        return [
            dropRequireCacheFunc,
            buildRequire(this._bhFile, 'var BH = '),
            'var bh = new BH();',
            'bh.setOptions({',
            '   jsAttrName: \'' + this._jsAttrName + '\',',
            '   jsAttrScheme: \'' + this._jsAttrScheme + '\'',
            '});',
            '',
            bhFiles.map(function (file) {
                return buildRequire(file.fullname, '', '(bh)');
            }).join('\n'),
            '',
            'module.exports = bh;'
        ].join('\n');
    })
    .createTech();
