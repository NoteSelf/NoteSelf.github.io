#!/bin/bash

# Build SamplePlugin for TiddlyWiki5

TIDDLYWIKI_PLUGIN_PATH="/h/My Dropbox/tiddlywiki/plugins/danielo515/tiddlypouchPlugin/master/src/plugins" tiddlywiki \
	./wiki \
	--verbose \
	--build \
	|| exit 1

mv ./wiki/output/readme.md readme.md
mv ./wiki/output/license.md license.md
mv ./wiki/output/index.html ../gh-pages
mv ./wiki/output/online.html ../gh-pages/online/index.html
mv ./wiki/output/recipes ../gh-pages/
mv ./wiki/output/PluginLibrary.html ../gh-pages/

cd ../gh-pages && git commit -am "$1" && git push origin master