function dropRequireCache(requireFunc, filename) {
    var module = requireFunc.cache[filename];
    if (module) {
        if (module.parent) {
            if (module.parent.children) {
                var moduleIndex = module.parent.children.indexOf(module);
                if (moduleIndex !== -1) {
                    module.parent.children.splice(moduleIndex, 1);
                }
            }
            delete module.parent;
        }
        delete module.children;
        delete requireFunc.cache[filename];
    }
};
dropRequireCache(require, require.resolve("../node_modules/bh/lib/bh.js"));
var BH = require("../node_modules/bh/lib/bh.js");
var bh = new BH();
bh.setOptions({
   jsAttrName: 'onclick',
   jsAttrScheme: 'js'
});

dropRequireCache(require, require.resolve("../blocks/block.bh.js"));
require("../blocks/block.bh.js")(bh);

module.exports = bh;
