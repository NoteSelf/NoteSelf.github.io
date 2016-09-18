#!/bin/bash

# Build SamplePlugin for TiddlyWiki5

TIDDLYWIKI_PLUGIN_PATH="/h/My Dropbox/tiddlywiki/plugins/danielo515/tiddlypouchPlugin/master/src/plugins" tiddlywiki \
	./wiki \
	--verbose \
	--build index --build OnlineDemo \
	|| exit 1

mv ./wiki/output/readme.md readme.md
mv ./wiki/output/license.md license.md
mv ./wiki/output/index.html ../gh-pages
mv ./wiki/output/online.html ../gh-pages/online/index.html

cd ../gh-pages && git add . && git commit -m "$1" && git push origin master