#!/bin/bash

# Build SamplePlugin for TiddlyWiki5

TIDDLYWIKI_PLUGIN_PATH="../../plugins_dist" tiddlywiki \
	./wiki \
	--verbose \
	--build index --build OnlineDemo \
	|| exit 1

# mv ./wiki/output/readme.md readme.md
# mv ./wiki/output/license.md license.md
mv ./wiki/output/index.html ../gh-pages
mv ./wiki/output/online.html ../gh-pages/online/index.html

cd ../gh-pages && git add . && git commit -m "${1:-Deployed to github pages}" && git push origin master