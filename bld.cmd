@echo off

rem Build SamplePlugin for TiddlyWiki5

tiddlywiki ^
	.\SamplePluginWiki ^
	--verbose ^
	--build ^
	|| exit 1

copy SamplePluginWiki\output\readme.md readme.md
copy SamplePluginWiki\output\license.md license.md
