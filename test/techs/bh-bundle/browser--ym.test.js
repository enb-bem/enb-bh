var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    FileList = require('enb/lib/file-list'),
    Tech = require('../../../techs/bh-bundle'),
    bhCoreFilename = require.resolve('bh/lib/bh.js'),
    htmlFilename = path.join(__dirname, '..', '..', 'fixtures', 'browser--ym.html'),
    mochaFilename = require.resolve('mocha/mocha.js'),
    chaiFilename = require.resolve('chai/chai.js'),
    ymFilename = require.resolve('ym/modules.js'),
    runServer = require('../../lib/run-server');

describe('bh-bundle --browser --ym', function () {
    afterEach(function () {
        mock.restore();
    });

    it('compiled files should works on client-side', function () {
        var test = generateTest({ block: 'block' }, '<a class="block"></a>');

        return runTest(test);
    });

    describe('mimic', function () {
        it('mimic as a string', function () {
            var test = [
                    'chai.should();',
                    'it("autogenerated test", function (done) {',
                        'modules.require("BEMHTML", function (BEMHTML) {',
                            'BEMHTML.apply({ block: "block" }).should.equal(\'<a class="block"></a>\');',
                            'done();',
                        '});',
                    '});'
                ].join('\n'),
                options = {
                    mimic: 'BEMHTML'
                };

           return runTest(test, options);
        });

        it('mimic to different template engines', function () {
            var test = [
                    'chai.should();',
                    'it("autogenerated test", function (done) {',
                        'modules.require(["BEMHTML", "render"], function (BEMHTML, render) {',
                            'BEMHTML.apply({ block: "block" }).should.equal(\'<a class="block"></a>\');',
                            'render.apply({ block: "block" }).should.equal(\'<a class="block"></a>\');',
                            'done();',
                        '});',
                    '});'
                ].join('\n'),
                options = {
                    mimic: ['BEMHTML', 'render']
                };

           return runTest(test, options);
        });
    });

    it('dependencies', function () {
        var test = generateTest({ block: 'block' }, '<div class="block">^_^</div>'),
            options = {
                dependencies: { A: 'A' }
            },
            template = 'bh.match("block", function(ctx) { ctx.content(bh.lib.A); });',
            lib = 'modules.define("A", function (provide) { provide("^_^"); });';

       return runTest(test, options, template, lib);
    });
});

function bhWrap(str) {
    return 'module.exports = function(bh) {' + str + '};';
}

function runTest(testContent, options, template, lib) {
    var bhTemplate = bhWrap(template || 'bh.match("block", function(ctx) { ctx.tag("a"); });'),
        bundle,
        fileList,

        scheme = {
            blocks: {
                'block.bh.js': bhTemplate
            },
            bundle: {},
            'index.html': fs.readFileSync(htmlFilename, 'utf-8'),
            'test.js': testContent,
            'mocha.js': fs.readFileSync(mochaFilename, 'utf-8'),
            'chai.js': fs.readFileSync(chaiFilename, 'utf-8'),
            'ym.js': fs.readFileSync(ymFilename, 'utf-8')
        };

    if (options && options.bhFile) {
        scheme['bh.js'] = options.bhFile;
        options.bhFile = 'bh.js';
    }

    scheme['some-ym-lib.js'] = lib || '';

    scheme[bhCoreFilename] = fs.readFileSync(bhCoreFilename, 'utf-8');

    mock(scheme);

    bundle = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndGetContent(Tech, options)
        .spread(function (bh) {
            // TODO: удалить, когда пофиксится https://github.com/enb-make/enb/issues/224
            fs.writeFileSync('bundle/bundle.bh.js', bh);

            return runServer(3000);
        });
}

function generateTest(json, expected) {
    expected = expected.replace(/'/g, '\\\'');

    return [
            'chai.should();',
            'it("autogenerated test", function (done) {',
                'modules.require("BH", function (BH) {',
                    'BH.apply(' + JSON.stringify(json) + ').should.equal(\'' + expected + '\');',
                    'done();',
                '});',
            '});'
    ].join('\n');
}