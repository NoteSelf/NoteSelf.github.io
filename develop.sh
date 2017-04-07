#!/bin/sh
#
# develop [<username>] [<password>]
# 
# Serves development TW5 over HTTP at localhost:8080
#
TIDDLYWIKI_PLUGIN_PATH="/h/My Dropbox/tiddlywiki/plugins/danielo515/tiddlypouchPlugin/master/tiddlypouchwiki/plugins" tiddlywiki \
	./wiki \
	--verbose \
	--server 8087 $:/core/save/all text/plain text/html '' '' 0.0.0.0
 
