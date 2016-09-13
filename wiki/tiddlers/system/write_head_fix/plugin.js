/*\
title: $:/core/modules/filters/plugin.js
type: application/javascript
module-type: filteroperator

Filter operator for selecting tiddlers from a plugin

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.plugin = function(source,operator,options) {
	return options.wiki.forTiddlersInTiddler(operator.operand);
}

})();
