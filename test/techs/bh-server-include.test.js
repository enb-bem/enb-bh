var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    bhServerInclude = require('../../techs/bh-server-include'),
    FileList = require('enb/lib/file-list'),
    bhCoreFilename = require.resolve('bh/lib/bh.js');

describe('bh-server-include', function () {
    var node, fileList;

    it('must compile bh-file', function () {
        var templates = [
                'bh.match("block", function(ctx) {ctx.tag("a");});'
            ],
            bemjson = { block: 'block' },
            html = '<a class="block"></a>';

        return assert(templates, bemjson, html);
    });

    it('must compile bh-file with custom core', function () {
        var templates = [
                'bh.match("block", function(ctx) { return "Not custom core!"; });'
            ],
            bemjson = { block: 'block' },
            html = '^_^',
            options = {
                bhFile: [
                    'function BH () {}',
                    'BH.prototype.apply = function() { return "^_^"; };',
                    'BH.prototype.match = function() {};',
                    'BH.prototype.setOptions = function() {};',
                    'module.exports = BH;'
                ].join('\n')
            };

        return assert(templates, bemjson, html, options);
    });

    describe('must compile bh-file with redefined jsAttr params', function () {

        it('must redefine jsAttrName', function () {
            var bemjson = { block: 'block', js: true },
                html = '<div class="block i-bem" data-bem="return {&quot;block&quot;:{}}"></div>',
                options = { jsAttrName: 'data-bem' };

            return assert(null, bemjson, html, options);
        });

        it('must redefine jsAttrScheme', function () {
            var bemjson = { block: 'block', js: true },
                html = '<div class="block i-bem" onclick="{&quot;block&quot;:{}}"></div>',
                options = { jsAttrScheme: 'json' };

            return assert(null, bemjson, html, options);
        });

    });

    it('must use cached bhFile', function () {
        var scheme = {
                blocks: {
                    'block.bh.js': bhWrap('bh.match("block", function(ctx) { ctx.tag("a"); });')
                },
                bundle: {},
                'core.bh.js': mock.file({
                    content: [
                        'function BH () {}',
                        'BH.prototype.apply = function() { return "^_^"; };',
                        'BH.prototype.match = function() {};',
                        'BH.prototype.setOptions = function() {};',
                        'module.exports = BH;'
                    ].join('\n'),
                    mtime: new Date(1)
                })
            };

        scheme[bhCoreFilename] = mock.file({
            content: fs.readFileSync(bhCoreFilename, 'utf-8'),
            mtime: new Date(1)
        });

        mock(scheme);

        node = new TestNode('bundle');
        fileList = new FileList();
        fileList.loadFromDirSync('blocks');
        node.provideTechData('?.files', fileList);

        return node.runTech(bhServerInclude)
            .then(function () {
                return node.runTechAndRequire(bhServerInclude, { bhFile: 'core.bh.js' })
            })
            .spread(function (bh) {
                bh.apply({ block: 'block' }).must.be('<a class="block"></a>');
            });

    });

    it('must rewrite cached bhFile if the new bhFile exist', function () {
        var scheme = {
                blocks: {
                    'block.bh.js': bhWrap('bh.match("block", function(ctx) { ctx.tag("a"); });')
                },
                bundle: {},
                'core.bh.js': mock.file({
                    content: [
                        'function BH () {}',
                        'BH.prototype.apply = function() { return "^_^"; };',
                        'BH.prototype.match = function() {};',
                        'BH.prototype.setOptions = function() {};',
                        'module.exports = BH;'
                    ].join('\n'),
                    mtime: new Date(2)
                })
            };

        scheme[bhCoreFilename] = mock.file({
            content: fs.readFileSync(bhCoreFilename, 'utf-8'),
            mtime: new Date(1)
        });

        mock(scheme);

        node = new TestNode('bundle');
        fileList = new FileList();
        fileList.loadFromDirSync('blocks');
        node.provideTechData('?.files', fileList);

        return node.runTech(bhServerInclude)
            .then(function () {
                return node.runTechAndRequire(bhServerInclude, { bhFile: 'core.bh.js' })
            })
            .spread(function (bh) {
                bh.apply({ block: 'block' }).must.be('^_^');
            });

    });

    it('must gemerate sourcemap', function () {
        var options = { sourcemap: true },
            bhFilename = path.join(__dirname, '..', 'fixtures', 'bh-server-include', 'test.bh.js');
            scheme = {
                blocks: {
                    'block.bh.js': bhWrap('bh.match("block", function(ctx) {ctx.tag("a");});')
                },
                bundle: {},
                'test.bh.js': fs.readFileSync(bhFilename, 'utf-8')
            };

        scheme[bhCoreFilename] = fs.readFileSync(bhCoreFilename, 'utf-8');

        mock(scheme);

        node = new TestNode('bundle');
        fileList = new FileList();
        fileList.loadFromDirSync('blocks');
        node.provideTechData('?.files', fileList);

        return node.runTechAndGetContent(bhServerInclude, options)
            .spread(function (bh) {
                var expect = fs.readFileSync('test.bh.js', 'utf-8');

                bh.toString().must.be.eql(expect);
            });

    });

    afterEach(function () {
        mock.restore();
    });
});

function bhWrap(str) {
    return 'module.exports = function(bh) {' + str + '};';
};

function assert(templates, bemjson, html, options) {
    var scheme = {
        blocks: {},
        bundle: {}
    };

    if(options && options.bhFile) {
        scheme['bh.js'] = options.bhFile;
        options.bhFile = 'bh.js';
    }

    templates && templates.forEach(function (item, i) {
        scheme.blocks['block-' + i + '.bh.js'] = bhWrap(item);
    });

    scheme[bhCoreFilename] = fs.readFileSync(bhCoreFilename, 'utf-8');

    mock(scheme);

    node = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    node.provideTechData('?.files', fileList);

    return node.runTechAndRequire(bhServerInclude, options)
        .spread(function (bh) {
            bh.apply(bemjson).must.be(html);
        });
};
