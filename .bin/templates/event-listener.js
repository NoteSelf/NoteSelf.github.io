/*\
title: $:/plugins/<:- author :>/events/<:- module_name :>
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
 * @module <:- module_name :>-startup
 */
exports.startup = () => {

    $tw.rootWidget.addEventListener("tm-your-message-name",
    (event) => {
        /** your code here */
    });
}


