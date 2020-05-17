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

const {SYNC_STATE} = require('$:/plugins/danielo515/tiddlypouch/constants')

module.exports = {
      // used on the UI of config couch database. It has a different constant name on tiddlypouch
      // TODO: make a function on tpouch side to get this info
     COUCH_CONFIG: '$:/plugins/danielo515/tiddlypouch/config/selected_database'
     , BACKEND_URL: "@@process.env.NOTESELF_BACKEND_URL"
     , SYNC_STATE
     // ----- UI Events
     , GET_PIN: "tm-get-pin"
     , VALIDATE_PIN: "tm-validate-pin"
     , CUSTOM_LOGIN: "tm-custom-login"
     , LOGOUT: "tm-NS-logout"
};
