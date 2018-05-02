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

const { backendUrl } = require('$:/plugins/noteself/core/config');


// Export name and synchronous status
exports.name = "login-events";
exports.after = ["startup"];
exports.platforms = ["browser"];
exports.synchronous = true;

const setText = (title, text) => $tw.wiki.setText(title, 'text', null, text);
const namespace = (prefix) => (fn) => (x, ...args) => fn(prefix + x, ...args);

const stateNamespace = namespace('$:/state/ns/');
const setTexState = stateNamespace(setText);
const validEmail = (email) => (/\w+@\w+\.\w{2,4}/).test(email)
/**
 * @function updateRemoteConfig
 * Checks if the global tiddlypouch object exists. 
 * If so it updates the current db configuration to store the API credentials
 * Note that we are using promises as Either (Left Right -> reject resolve)
 * @param  {Object} options          Object containing the required fields
 * @param  {Object} options.db       Remote database name
 * @param  {Object} options.host     Hostname where the remote database is
 * @param  {Object} options.key      The username of the API key
 * @param  {Object} options.password The password of the API key
 * @return {Promise} Resolves to a dbConfig of the updated config or rejects to an error message
 */
const updateRemoteConfig = ({ db, host, key, password }) => {

    return (!$TPouch) 
    ? Promise.reject('TiddlyPouch is not installed!!! It is a mandatory dependency')
    : Promise.resolve(
        $TPouch.config.updateRemoteConfig({
            name: db,
            url: 'https://' + host,
            username: key,
            password
        }))
}

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

const requestPin = (email) => {

    setTexState('waiting-pin', 'yes');
    return axios
        .post(backendUrl + '/api/register', {
            email
        })
        .then(({ data: { correlation_id } }) => {
            setTexState('correlation-id', correlation_id);
        })
        .catch(() => setTexState('waiting-pin', 'no'))
}

const validatePin = (pin, correlation_id) => {
    return axios
        .post(backendUrl + '/api/login', {
            pin, correlation_id
        })
        .then(({ data }) => updateRemoteConfig(data) )
        .catch((error) => {
            setTexState('waiting-pin', 'no')
        })
}


/**
 * @module login-startup
 */
exports.startup = () => {

    // ===== EVENT HANDLERS =====
    // This events arises on the UI and are dispatched to the internal methods
    $tw.rootWidget.addEventListener("tm-get-pin",
        ({ param: email }) => {
            console.log('Trying to get a pin', email);
            validEmail(email)
                ? requestPin(email)
                : markInvalidField(email, 'Invalid email');
        });

    $tw.rootWidget.addEventListener("tm-validate-pin",
        ({ param: pin, paramObject: { correlation_id } }) => {
            validatePin(pin, correlation_id);
        });

}


