# API технологий

Пакет предоставляет следующие технологии:

* для сборки BH-шаблонов:
  * [bh-bundle](#bh-bundle)
  * [bh-commonjs](#bh-commonjs)
* для генерации HTML:
  * [bemjson-to-html](#bemjson-to-html)

## bh-bundle

Собирает `bh.js`-файлы блоков и ядро в один файл — `?.bh.js`-бандл, который используется для работы как в браузере, так и в Node.js. После сборки не требует подключения исходных файлов шаблонов.

Поддерживает модульные системы [YModules](https://github.com/ymaps/modules/blob/master/README.ru.md) и частично [CommonJS](http://www.commonjs.org/), так как в `bh.js`-файлах функция `require` не будет работать корректно.

Если в исполняемой среде нет ни одной модульной системы, то модуль будет предоставлен в глобальную переменную `BH`.

### Опции

Опции указываются в конфигурационном файле (.enb/make.js).

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

Тип: `String`. По умолчанию: `?.bh.js`.

Имя скомпилированного файла, куда будет записан результат сборки необходимых `bh.js`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.ru.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bh.js']`.

Суффиксы файлов, по которым отбираются файлы с BH-шаблонами для дальнейшей сборки.

#### bhFilename

Тип: `String`. По умолчанию: `require.resolve('bh/lib/bh.js')`.

Путь к файлу с ядром BH.

Следует использовать, если необходима нестандартная версия [шаблонизатора BH](https://ru.bem.info/technology/bh/).

**Важно!** Технология [bh-bundle](#bh-bundle) гарантирует правильную работу только с шаблонизатором BH версии `4.1.0`

#### sourcemap

Тип: `Boolean`. По умолчанию: `false`.

Построение карт кода (source maps) с информацией об исходных файлах. Карты встраиваются в скомпилированный файл `?.files`, а не хранятся в отдельном файле с расширением `.map`.

#### requires

Тип: `Object`. По умолчанию: `{}`.

Задает имена или пути для подключения внешних библиотек в пространстве имен `bh.lib` — `bh.lib.name`.

> Принцип работы описан в разделе [Подключение сторонних библиотек](README.md#Особенности-работы-пакета).

#### mimic

Тип: `String | String[]`. По умолчанию — `['bh']`.

Задает имена новых переменных.

> Принцип работы описан в разделе [Мимикрия под BEMHTML](README.md#Мимикрия-под-bemhtml).

#### scope

Тип: `String`. По умолчанию: `template`.

Задает область видимости для исходного кода шаблонов.

Возможные значения:

* `template` — изолирует выполнение шаблонов друг от друга;
* `global`— позволяет выполнять шаблоны в общей области видимости.

#### bhOptions

Тип: `Object`. По умолчанию: `{}`.

Настраивает шаблонизатор BH с помощью переданных опций.

> Возможные настройки описаны в [документации шаблонизатора](https://github.com/bem/bh/blob/master/README.ru.md#Настройка).

**Пример**

```js
var BHBundleTech = require('enb-bh/techs/bh-bundle'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

 module.exports = function(config) {
     config.node('bundle', function(node) {
         // Получаем FileList
         node.addTechs([
             [FileProvideTech, { target: '?.bemdecl.js' }],
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Создаем BH-файл
         node.addTech(BHBundleTech);
         node.addTarget('?.bh.js');
     });
 };
```

## bh-commonjs

Собирает `bh.js`-файлы блоков в один файл — `?.bh.js`-бандл, который используется для работы в Node.js. После сборки требуется наличие всех файлов, подключенных с помощью `require`.

В шаблоны зависимости подключаются с помощью `require`. Все пути обрабатываются относительно того файла, в котором прописан `require`.

Результат сборки — `?.bh.js`-файл, который содержит подключения необходимых исходных `bh.js`-файлов и файла ядра из `node_modules`.

### Опции

Опции указываются в конфигурационном файле (.enb/make.js).

* [target](#target-1)
* [filesTarget](#filestarget-1)
* [sourceSuffixes](#sourcesuffixes-1)
* [bhFilename](#bhfilename-1)
* [devMode](#devmode)
* [mimic](#mimic)
* [bhOptions](#bhoptions-1)

#### target

Тип: `String`. По умолчанию: `?.bh.js`.

Имя таргета, куда будет записан результат сборки необходимых `bh.js`-файлов проекта — скомпилированный файл `?.bh.js`.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.ru.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bh.js']`.

Суффиксы файлов, по которым отбираются файлы с BH-шаблонами для дальнейшей сборки.

#### bhFilename

Тип: `String`. По умолчанию: `require.resolve('bh/lib/bh.js')`.

Путь к файлу с ядром BH.

Следует использовать, если необходима нестандартная версия [шаблонизатора BH](https://ru.bem.info/technology/bh/).

**Важно!** технология [bh-commonjs](#bh-commonjs) гарантирует правильную работу только с шаблонизатором BH версии `4.1.0` и выше.

#### devMode

Тип: `Boolean`. По умолчанию: `true`.

Режим сборки, при котором каждое новое подключение собранного файла инициирует сброс кэша `require` для всех внутренних файлов. Это позволяет видеть изменения в шаблонах без перезапуска Node.js.

#### mimic

Тип: `String | Array`. По умолчанию: `['bh']`.

Задает имена новых переменных.

> Принцип работы описан в разделе [Мимикрия под BEMHTML](README.md#Мимикрия-под-bemhtml).

#### bhOptions

Тип: `Object`. По умолчанию: `{}`.

Настраивает шаблонизатор BH с помощью переданных опций.

> Возможные настройки описаны в [документации шаблонизатора](https://github.com/bem/bh/blob/master/README.ru.md#Настройка).

**Пример**

```js
var BHCommonJSTech = require('enb-bh/techs/bh-commonjs'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем FileList
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Собираем BH-файл
        node.addTech(BHCommonJSTech);
        node.addTarget('?.bh.js');
    });
};
```

## bemjson-to-html

Предназначена для сборки HTML-файла. Обрабатывает [BEMJSON](https://ru.bem.info/platform/bemjson/) и скомпилированный `?.bh.js`-файл (результат работы технологий [bh-bundle](#bh-bundle) или [bh-commonjs](#bh-commonjs)) для получения HTML.

### Опции

Опции указываются в конфигурационном файле (.enb/make.js).

* [bhFile](#bhfile)
* [bemjsonFile](#bemjsonfile)
* [target](#target-2)

#### bhFile

Тип: `String`. По умолчанию: `?.bh.js`.

Имя файла, в котором содержится шаблон, скомпилированный одной из технологий ([bh-bundle](#bh-bundle) или [bh-commonjs](#bh-commonjs)). Используется для преобразования BEMJSON в HTML.

#### bemjsonFile

Тип: `String`. По умолчанию: `?.bemjson.js`.

Имя BEMJSON-файла, к которому применится скомпилированный шаблон `?.bh.js` (результат работы технологий [bh-bundle](#bh-bundle) или [bh-commonjs](#bh-commonjs)) для получения HTML.

#### target

Тип: `String`. По умолчанию: `?.html`.

HTML-файл — результат применения скомпилированного шаблона к указанному BEMJSON-файлу.

**Пример**

```js
var BemjsonToHtmlTech = require('enb-bh/techs/bemjson-to-html'),
    BHCommonJSTech = require('enb-bh/techs/bh-commonjs'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем BEMJSON-файл
        node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);

        // Получаем FileList
        node.addTechs([
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.bemjsonToBemdecl],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Собираем BH-файл
        node.addTech(BHCommonJSTech);
        node.addTarget('?.bh.js');

        // Создаем HTML-файл
        node.addTech(BemjsonToHtmlTech);
        node.addTarget('?.html');
    });
};
```
