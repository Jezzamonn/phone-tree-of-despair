const express = require('express');
const { hold } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function registration(twiml) {
    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/registration2',
    });
    gatherNode.say({voice: 'alice', language: 'en-GB'},
        'Welcome to the registration office. May I have your name?');
    twiml.redirect('./registration2');
};

/**
 * @param {VoiceResponse} twiml
 */
function registration2(twiml) {
    // We don't actually use the response from the user haha.
    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/registration3',
        hints: 'yes,no',
    });
    gatherNode.say({voice: 'alice', language: 'en-GB'},
        "I got");
    gatherNode.pause();
    gatherNode.say({voice: 'alice', language: 'en-GB'},
        "Gregory McGorsington");
    gatherNode.pause();
    gatherNode.say({voice: 'alice', language: 'en-GB'}, "is that correct?");

    twiml.redirect('./registration-fail');
};

/**
 * @param {VoiceResponse} twiml
 * @param {express.Request} request
 */
function registration3(twiml, request) {
    if (request.body.SpeechResult.toLowerCase().includes('yes')) {
        twiml.say({voice: 'alice', language: 'en-GB'},
            'You win!');
    }
    else {
        registrationFail(twiml);
    }
};

/**
 * @param {VoiceResponse} twiml
 */
function registrationFail(twiml) {
    twiml.say({voice: 'alice', language: 'en-GB'},
        'Sorry about that. Please hold');
    hold(twiml);
};

module.exports = {
    registration,
    registration2,
    registration3,
    registrationFail,
};
