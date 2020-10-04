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
        case '123':
            twiml.redirect('/directory');
            break;
        case '575':
            twiml.say("That's the ID department");
            break;
        case '818':
            twiml.redirect('/address');
            break;
        case '828':
            twiml.redirect('/office-address');
            break;
        case '353':
            twiml.say("That's the date department");
            break;
        case '364':
            twiml.say("That's Bob's office");
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
