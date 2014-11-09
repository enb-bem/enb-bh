/**
 * bh-server-coverage
 * =================
 *
 * Склеивает *bh*-файлы по deps'ам в виде `?.bh.js`, инструментируя их при помощи istanbul.
 * Предназначен для сборки статистики покрытия тестами серверного BH-кода.
 * Предполагается, что в *bh*-файлах не используется `require`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bh.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — ['bh'].
 * * *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
 * * *String* **jsAttrScheme** — Cхема данных для параметров инициализации. По умолчанию — `js`.
 * *                             Форматы:
 * *                                `js` — Получаем `return { ... }`.
 * *                                `json` — JSON-формат. Получаем `{ ... }`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-bh/techs/bh-server-coverage'));
 * ```
 */
var path = require('path');
var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter({
    coverageVariable: '__bh_coverage__'
});

module.exports = require('./bh-server-include').buildFlow()
    .methods({
        _preConcatFile: function (file, content) {
            var filePath = path.relative(process.cwd(), file.fullname);
            return instrumenter.instrumentSync(content, filePath);
        }
    })
    .createTech();
