const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { hold, playSound } = require('./common');

/**
 * @param {VoiceResponse} twiml
 */
function checkExtension(twiml, {digits=''}={}) {
    // If the user entered digits, process their request
    switch (digits) {
        case '111':
            twiml.redirect('/registration');
            break;
        case '123':
            twiml.redirect('/directory');
            break;
        case '575':
            twiml.redirect('/id');
            break;
        case '818':
            twiml.redirect('/address');
            break;
        case '828':
            twiml.redirect('/office-address');
            break;

        // Noise / datetime section
        case '303':
            playSound(twiml, 'noise/dtmf.mp3');
            break;
        case '313':
            playSound(twiml, 'noise/mumbling.mp3');
            break;
        case '323':
            playSound(twiml, 'noise/oof.mp3');
            break;
        case '333':
            playSound(twiml, 'noise/hello.mp3');
            break;
        case '343':
            playSound(twiml, 'noise/traffic.mp3');
            break;
        case '353':
            twiml.redirect('/datetime');
            break;
        case '363':
            playSound(twiml, 'noise/wahwahnoise.mp3');
            break;
        case '373':
            playSound(twiml, 'noise/mumbling-distorted.mp3');
            break;
        case '383':
            playSound(twiml, 'noise/crinkling.mp3');
            break;
        case '393':
            playSound(twiml, 'noise/chickensound.mp3');
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
