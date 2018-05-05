// import babel plugin
const babel = require('broccoli-babel-transpiler');
const uglify = require('broccoli-uglify-sourcemap');
const Funnel = require("broccoli-funnel");
const Merge = require("broccoli-merge-trees");
const CompileSass = require("broccoli-sass-source-maps");
const  replace = require('broccoli-replace');

const appRoot = "src";

// ===== SELECTING FILES =====
// First select all the source files and put them into trees with Funnel. 
// We use different trees for js metadata files and saas
const info = new Funnel(appRoot, {
    include: ["**/*.info", '**/*.files','**/*.tid','**/*.multids'],
    annotation: "Metadata files",
});

let js = new Funnel(appRoot, {
    include: ['**/*.js']
})

// ===== COMPILE JAVASCRIPT =====
js = replace(js, {
    files: [
      '**/*.js'
    ],
    patterns: [
      {
        match: 'process.env.NOTESELF_BACKEND_URL',
        replacement: process.env.NOTESELF_BACKEND_URL || "http://localhost:5000"
      }
    ]
  });

js = babel(js, {
    annotation: 'JS source code'
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

// ===== COMPILE SASS =====
const css = new CompileSass(
    [appRoot],
    "core/styles/main.scss",
    "core/styles/main.css",
    {
        annotation: "Sass files",
    }
);

// ===== FINAL OUTPUT =====
module.exports = new Merge([js, css, info], { annotation: "Final output" });
