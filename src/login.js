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
const validEmail = (email) => (/\w+@\w+\.\w{2,4}/).test(email)

/**
 * @function markInvalidField
 * @description mars a form field as invalid. 
 * The current value will be used for clearing the error message as soon as the
 * invalid value and the current value are not the same (check $:/plugins/noteself/core/form-error )
 * @param  {String} value The invalid value (will be compared with current one)
 * @param  {String} error The error string that should be displayed
 * @return {Void} Currently this returns nothing
 */
const markInvalidField = (value, error) => {
    setTexState('login-error', error);
    setTexState('invalid-value', value);
}

/**
 * @module login-startup
 */
exports.startup = () => {

    $tw.rootWidget.addEventListener("tm-get-pin",
    ({param: email}) => {
        console.log('Trying to get a pin', email);
        validEmail(email) 
            ? setTexState('waiting-pin','yes')
            : markInvalidField(email, 'Invalid email');
    });

    $tw.rootWidget.addEventListener("tm-validate-pin",
    ({param: pin}) => {
        console.log('Trying to validate a pin', pin);
    });

}


