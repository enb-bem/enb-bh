var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    HtmlFromBemjsonTech = require('../../techs/html-from-bemjson');

describe('html-from-bemjson', function () {
    var node,
        bhCoreFilename = require.resolve('bh/lib/bh.js'),
        bhFilename = path.join(__dirname, '..', 'fixtures', 'html-from-bemjson', 'test.bh.js');

    beforeEach(function () {
        var scheme = {
            blocks: {
                'block.bh.js': 'module.exports = function(bh) {bh.match("block", function(ctx) {ctx.tag("a");});};'
            },
            bundle: {
                'bundle.bemjson.js': '({ block: "block" })',
                'bundle.bh.js': fs.readFileSync(bhFilename, 'utf-8')
            }

        };

        scheme[bhCoreFilename] = fs.readFileSync(bhCoreFilename, 'utf-8')

        mock(scheme);

        node = new TestNode('bundle');
    });

    it('must generate html', function () {
        return node.runTechAndGetContent(
            HtmlFromBemjsonTech
        ).spread(function (html) {
            html.toString().must.be('<a class="block"></a>');
        });
    });

    afterEach(function () {
        mock.restore();
    });
});
