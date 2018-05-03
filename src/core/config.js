/*\
title: $:/plugins/noteself/core/config
type: application/javascript
module-type: library

Config variables for noteself core

@preserve

\*/

/*jslint node: true, browser: true */
/*global $tw: false */

'use strict';

const {BACKEND_URL} = require('$:/plugins/noteself/core/constants');

module.exports = {
    request: axios.create({ baseURL: BACKEND_URL})
}
