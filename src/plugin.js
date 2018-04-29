/*\
title: $:/plugins/noteself/utils/logger.js
type: application/javascript
module-type: library
A basic logging implementation

@preserve

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const {Logger: TwLogger} = require('$:/core/modules/utils/logger.js');

/**
* Make a new logger
* @class
* @param {String} componentName - This will be displayed on the logging messages as header
* @param {Object|boolean} debug - A debug config object with debug and verbose booleans or a boolean indicating that debug level is active
* @param {boolean} verbose - if verbose debug level is active (used on trace method)
*
*/
class Logger extends TwLogger {
    constructor(componentName, debug, verbose) {
        super(componentName);

        if (typeof debug === "object") {
            verbose = debug.verbose;
            debug = debug.debug
        }
        this.isDebug = debug;
        this.isVerbose = verbose;
    }

    
    /**
     * Log only if there is debug enabled
     * @returns {undefined} returns nothing
     */
    debug(){
        if (!this.isDebug) {
            return
        }
        this.log.apply(this, Array.prototype.slice.call(arguments, 0))
    }

    /**
     * Log only if debug is verbose
     * @returns {undefined} returns nothing
     */
    trace(){
        if (!this.isVerbose) {
            return
        }
        this.debug.apply(this, Array.prototype.slice.call(arguments, 0))
    }
}

exports.Logger = Logger;