/*\
title: $:/plugins/noteself/core/constants
type: application/javascript
module-type: library

Constants used to name events and config tiddlers similar stuff

@preserve

\*/

/*jslint node: true, browser: true */
/*global $tw: false */

'use strict';

module.exports = {
     COUCH_CONFIG: '$:/plugins/danielo515/tiddlypouch/config/selected_database' // used on the UI of config couch database
     , BACKEND_URL: "@@process.env.NOTESELF_BACKEND_URL"
     // ----- UI Events
     , GET_PIN: "tm-get-pin"
     , VALIDATE_PIN: "tm-validate-pin"
};
