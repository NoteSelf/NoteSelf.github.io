#!/bin/bash

# Build the test version of noteself

TIDDLYWIKI_PLUGIN_PATH="../../plugins_dist" tiddlywiki \
	./wiki \
	--verbose \
    --build OnlineDemo \
	|| exit 1

mv ./wiki/output/online.html ../gh-pages/nightly/index.html

cd ../gh-pages && git add . && git commit -m "Testing: $1" && git push origin master