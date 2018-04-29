/*\
title: $:/plugins/<:- author :>/<:- module_name :>
type: application/javascript
module-type: startup

<:= description :>

@preserve

\*/



/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "<:- module_name :>";
exports.after = ["startup"];
exports.platforms = ["browser"];
exports.synchronous = true;



/**
 * @module config-startup
 */
exports.startup = () => {
    /** your code here */
}
