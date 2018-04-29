// import babel plugin
const babel = require('broccoli-babel-transpiler');
const uglify = require('broccoli-uglify-sourcemap');
const Funnel = require("broccoli-funnel");
const Merge = require("broccoli-merge-trees");

const appRoot = "src";

// Copy plugin
const info = new Funnel(appRoot, {
    files: ["plugin.info"],
    annotation: "Plugin info file",
});

let js = babel(appRoot, {
    annotation: 'JS source code'
    , filterExtensions:['js']
    , presets: [
        ['env', {
            'targets': {
                'browsers': ["last 2 versions"]
            }
        }]
    ]
});

js = uglify(js, {
    annotation: 'Uglify js files',
    uglify: {
        warnings: true,
        sourceMap: !process.env.PRODUCTION,
        output: { comments: 'some' }
    }
});

module.exports = new Merge([js,info], {overwrite: true, annotation: "Final output"});
