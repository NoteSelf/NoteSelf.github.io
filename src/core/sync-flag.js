/*\
title: $:/plugins/noteself/core/startup/sync-flag
type: application/javascript
module-type: startup

A workaround to make the login button appear on NS

@preserve

\*/



/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "sync-flag";
exports.after = ["pouchdb-syncer"];
exports.platforms = ["browser"];
exports.synchronous = true;



/**
 * @module config-startup
 */
exports.startup = () => {
    const { SYNC_ICON } = require('$:/plugins/danielo515/tiddlypouch/constants.js');
    $tw.utils.setTags(SYNC_ICON,['$:/tags/PageControls']);
}
