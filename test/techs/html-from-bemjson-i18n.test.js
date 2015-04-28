var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    HtmlFromBemjsonI18NTech = require('../../techs/html-from-bemjson-i18n');

describe('html-from-bemjson-i18n', function () {
    var node,
        bhCoreFilename = require.resolve('bh/lib/bh.js'),
        bhFilename = path.join(__dirname, '..', 'fixtures', 'html-from-bemjson', 'test.bh.js');

    beforeEach(function () {
        var scheme = {
            blocks: {
                'block.bh.js': [
                    'module.exports = function(bh) {',
                    '    bh.match("block", function(ctx) { ctx.content(BEM.I18N()); });',
                    '};'
                ].join('\n')
            },
            bundle: {
                'bundle.bemjson.js': '({block: "block"})',
                'bundle.bh.js': fs.readFileSync(bhFilename, 'utf-8'),
                'bundle.lang.all.js': [
                    'var BEM = {',
                    '    I18N: function () {',
                    '        return "i18n";',
                    '    }',
                    '};'
                ].join('\n'),
                'bundle.lang.ru.js': ''
            }
        };

        scheme[bhCoreFilename] = fs.readFileSync(bhCoreFilename, 'utf-8')

        mock(scheme);

        node = new TestNode('bundle');
    });

    it('must generate html with i18n', function () {
        return node.runTechAndGetContent(
            HtmlFromBemjsonI18NTech, { lang: 'ru' }
        ).spread(function (html) {
            html.toString().must.be('<div class="block">i18n</div>');
        });
    });

    afterEach(function () {
        mock.restore();
    });
});
