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

// I'm really sorry about this. We need to defer the require of the request until axios has been injected on the page. The require is far below
let request; 
const { COUCH_CONFIG, GET_PIN, VALIDATE_PIN } = require('$:/plugins/noteself/core/constants');


// Export name and synchronous status
exports.name = "login-events";
exports.after = ["startup"];
exports.platforms = ["browser"];
exports.synchronous = true;

const extend = (o, ...os) => $tw.utils.extend(o, ...os)
const setText = (title, text) => $tw.wiki.setText(title, 'text', null, text);
const getText = (title) => $tw.wiki.getTiddlerText(title);
const getJSON = (title) => $tw.wiki.getTiddlerData(title);
const extendTiddler = (title, ...os) => setText(title, JSON.stringify(extend(getJSON(title), ...os)));
const namespace = (prefix) => (fn) => (x, ...args) => fn(prefix + x, ...args);

const stateNamespace = namespace('$:/state/ns/');
const setTextState = stateNamespace(setText);
const isValidEmail = (email) => (/\w+@\w+\.\w{2,4}/).test(email)
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

    if (!$TPouch) {
        console.error('TiddlyPouch is not installed!!! It is a mandatory dependency');
        Promise.reject(new Error('Missing TPouch dependency'))
    }

    return $TPouch
    .config
    .updateRemoteConfig({ 
        name: db,
        url: 'https://' + host,
        username: key,
        password
    })// this returns the newly created configuration, which can be passed directly to refresh-ui
    .then($TPouch.ui.refresh)
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
    setTextState('login-form-error', error);
    setTextState('invalid-value', value);
}

/**
 * @function handleAxiosError
 * Axis report all non 2XX responses as errors. 
 * The actual error reason (API response) ins buried inside the response section of the error.
 * This function adds that important data to the root of the error and re-throws it
 * @param  {Error} err An error returned by axios
 * @return {void} This functions returns nothing. It just re-trhows the error
 */
const handleAxiosError = (err) => {
    throw (!err.response) 
    ? err 
    : extend(err, { message: err.response.data.message, statusCode: err.response.status}) // Enrich the error with response data
};

/**
 * @function requestPin
 * Given an email asks for a session (correlation_id) to the NoteSelf server.
 * When you asks for a session providing an email a PIN is generated and sent to tat email.
 * The correlation_id is stored on a state tiddler
 * @param  {String} email A valid email
 * @return {Promise} on @fulfil undefined is returned because the given correlation_id is stored on a temp tiddler
 * on @reject the waiting-pin tiddler is cleared
 */
const requestPin = (email) => {

    setTextState('waiting-pin', 'yes');
    return request
        .post('/api/register', {
            email
        })
        .then(({ data: { correlation_id } }) => {
            setTextState('correlation-id', correlation_id);
        })
        .catch(handleAxiosError)
        .catch((err) => {
            setTextState('waiting-pin', 'no')
            setTextState('login-error', err.message);
        })
}

/**
 * @function validatePin
 * Checks the provided pin against the NoteSelf backend server.
 * The correlation_id was provided by the NS server before
 * @param  {String} pin            Five digits pin. Must be an string to preserve padding zeros
 * @param  {String} correlation_id Id that identifies the current session and it's directly related to the PIN
 * @return {Promise} @fulfills to an auth token description (key, password, db and host)
 */
const validatePin = (pin, correlation_id) => {
    return request
        .post('/api/login', {
            pin, correlation_id
        })
        .then(({ data }) => data)
        .catch(handleAxiosError)
}


/**
 * @module login-startup
 */
exports.startup = () => {

    request = require('$:/plugins/noteself/core/config').request; // request is an axios instance with the NoteSelf server as baseurl

    // ===== EVENT HANDLERS =====
    // This events arises on the UI and are dispatched to the internal methods
    $tw.rootWidget.addEventListener(GET_PIN,
        ({ param: email }) => {
            console.log('Trying to get a pin', email);
            isValidEmail(email)
                ? requestPin(email)
                : markInvalidField(email, 'Invalid email');
        });

    $tw.rootWidget.addEventListener(VALIDATE_PIN,
        ({ param: pin, paramObject: { correlation_id } }) => {
            validatePin(pin, correlation_id)
                .then(updateRemoteConfig)
                .catch((err) => {
                    setTextState('waiting-pin', 'no')
                    setTextState('login-error', err.message);
                })
        });

}


