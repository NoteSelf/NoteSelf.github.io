/*\
title: $:/plugins/noteself/events/login
type: application/javascript
module-type: startup

Event handlers for the login flow

@preserve

\*/


/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "login-events";
exports.after = ["startup"];
exports.platforms = ["browser"];
exports.synchronous = true;

const setText = (title,text) => $tw.wiki.setText(title,'text',null,text);
const namespace = (prefix) => (fn) => (x, ...args) => fn(prefix + x, ...args);

const stateNamespace = namespace('$:/state/ns/');
const setTexState = stateNamespace(setText);

/**
 * @module login-startup
 */
exports.startup = () => {

    $tw.rootWidget.addEventListener("tm-get-pin",
    ({param: email}) => {
        console.log('Trying to get a pin', email);
        setTexState('waiting-pin','yes')
    });

    $tw.rootWidget.addEventListener("tm-validate-pin",
    ({param: pin}) => {
        console.log('Trying to validate a pin', pin);
    });

}


