enb-bh
======

[![NPM version](https://img.shields.io/npm/v/enb-bh.svg?style=flat)](http://badge.fury.io/js/enb-bh) [![Build Status](https://img.shields.io/travis/enb-bem/enb-bh/master.svg?style=flat)](https://travis-ci.org/enb-bem/enb-bh) [![Dependency Status](https://img.shields.io/david/enb-bem/enb-bh.svg?style=flat)](https://david-dm.org/enb-bem/enb-bh)

Поддержка [`bh`](https://github.com/enb-make/bh) для ENB.

Установка:
----------

```sh
$ npm install --save-dev enb-bh
```

Технологии
----------

* [bh-client](#bh-client)
* [bh-client-module](#bh-client-module)
* [bh-server](#bh-server)
* [bh-server-include](#bh-server-include)
* [html-from-bemjson](#html-from-bemjson)
* [html-from-bemjson-i18n](#html-from-bemjson-i18n)

Для работы модуля требуется зависимость от пакета `enb` версии `0.12.0` или выше.

### bh-client

Склеивает `bh`-файлы по deps'ам в виде `?.bh.client.js`. Предназначен для сборки клиентского BH-кода.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bh.client.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bh.js']`.
* *Boolean* **sourcemap** — строить карты кода.
* *String* **mimic** — имя переменной для экспорта.
* *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
* *String* **jsAttrScheme** — Схема данных для параметров инициализации. По умолчанию — `js`. Форматы: `js` — Получаем `return { ... }`. `json` — JSON-формат. Получаем `{ ... }`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/bh-client'));
```

### bh-client-module

Склеивает `bh`-файлы по deps'ам в виде `?.bh.client.js`. Предназначен для сборки клиентского BH-кода. Использует модульную обертку.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bh.client.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bh.js']`.
* *Boolean* **sourcemap** — строить карты кода.
* *String* **mimic** — имя модуля для экспорта.
* *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
* *String* **jsAttrScheme** — Схема данных для параметров инициализации. По умолчанию — `js`. Форматы: `js` — Получаем `return { ... }`. `json` — JSON-формат. Получаем `{ ... }`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/bh-client-module'));
```

### bh-server

Склеивает *bh*-файлы по deps'ам с помощью набора `require` в виде `?.bh.js`. Предназначен для сборки серверного BH-кода. После сборки требуется наличие всех файлов, подключённых с помощью набора `require`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bh.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bh.js']`.
* *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
* *String* **jsAttrScheme** — Схема данных для параметров инициализации. По умолчанию — `js`. Форматы: `js` — Получаем `return { ... }`. `json` — JSON-формат. Получаем `{ ... }`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/bh-server'));
```

### bh-server-include

Склеивает `bh`-файлы по deps'ам в виде `?.bh.js`. Предназначен для сборки серверного BH-кода. Предполагается, что в `bh`-файлах не используется `require`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bh.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bh.js']`.
* *Boolean* **sourcemap** — строить карты кода.
* *String* **jsAttrName** — атрибут блока с параметрами инициализации. По умолчанию — `onclick`.
* *String* **jsAttrScheme** — Схема данных для параметров инициализации. По умолчанию — `js`. Форматы: `js` — Получаем `return { ... }`. `json` — JSON-формат. Получаем `{ ... }`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/bh-server-include'));
```

### html-from-bemjson

Собирает *html*-файл с помощью *bemjson* и *bh*.

**Опции**

* *String* **bhFile** — Исходный BH-файл. По умолчанию — `?.bh.js`.
* *String* **bemjsonFile** — Исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
* *String* **target** — Результирующий HTML-файл. По умолчанию — `?.html`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/html-from-bemjson'));
```

### html-from-bemjson-i18n

Собирает *html*-файл с помощью *bemjson*, *bh*, *lang.all* и *lang.{lang}*.

**Опции**

* *String* **bhFile** — Исходный BH-файл. По умолчанию — `?.bh.js`.
* *String* **bemjsonFile** — Исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
* *String* **langAllFile** — Исходный langAll-файл. По умолчанию — `?.lang.all.js`.
* *String* **langFile** — Исходный lang-файл. По умолчанию — `?.lang.{lang}.js`. Если параметр lang не указан, берется первый из объявленных в проекте языков
* *String* **target** — Результирующий HTML-файл. По умолчанию — `?.{lang}.html`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bh/techs/html-from-bemjson-i18n'));
```

Лицензия
--------

© 2014 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
