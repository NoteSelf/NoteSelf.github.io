// import babel plugin
const babel = require('broccoli-babel-transpiler');
const uglify = require('broccoli-uglify-sourcemap');
const Funnel = require("broccoli-funnel");
const Merge = require("broccoli-merge-trees");
const CompileSass = require("broccoli-sass-source-maps");


const appRoot = "src";

// Copy plugin
const info = new Funnel(appRoot, {
    include: ["**/*.info", '**/*.files','**/*.tid'],
    annotation: "Metadata files",
});

let js = new Funnel(appRoot, {
    include: ['**/*.js']
})

js = babel(js, {
    annotation: 'JS source code'
    , filterExtensions: ['js']
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

// Compile sass files
const css = new CompileSass(
    [appRoot],
    "styles/main.scss",
    "styles/main.css",
    {
        annotation: "Sass files",
    }
);

module.exports = new Merge([js, css, info], { annotation: "Final output" });
