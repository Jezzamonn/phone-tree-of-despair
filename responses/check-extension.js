const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { hold } = require('./common');

/**
 * @param {VoiceResponse} twiml
 * @param {express.Request} request
 */
function checkExtension(twiml, request) {
    // If the user entered digits, process their request
    switch (request.body.Digits) {
        case '111':
            twiml.redirect('/registration');
            break;
        default:
            twiml.say("Sorry, that's not a valid response. Please hold.");
            hold(twiml);
            break;
    }
};

module.exports = {
    checkExtension
};
