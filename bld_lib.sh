#!/bin/bash

# Build SamplePlugin for TiddlyWiki5

TIDDLYWIKI_PLUGIN_PATH="/h/My Dropbox/tiddlywiki/plugins/danielo515/tiddlypouchPlugin/master/src/plugins" tiddlywiki \
	./wiki \
	--verbose \
	--build library
	|| exit 1

rm -rf ../gh-pages/recipes
mv ./wiki/output/recipes ../gh-pages/
mv ./wiki/output/PluginLibrary.html ../gh-pages/

cd ../gh-pages && git commit -am "Plugin library update" && git push origin master