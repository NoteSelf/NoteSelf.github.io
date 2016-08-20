@echo off
rem develop.cmd [<username>] [<password>]
rem
rem Serves development TW5 over HTTP at localhost:8080
rem
tiddlywiki.cmd ^
	.\ ^
	--verbose ^
	--server 8092 $:/core/save/all text/plain text/html %1 %2
