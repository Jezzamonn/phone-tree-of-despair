const { getRegistrationId, getRegistrationDate, getRegistrationPostalCode } = require('./answers');
const { hold } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function registration(twiml) {
    twiml.say('Welcome to the registration office. May I have your name?');
    twiml.pause();
    twiml.pause();
    twiml.pause();
    twiml.say('I got "James Smith", is that correct?');
    twiml.gather({
        input: 'speech',
        action: '/registration-name-response',
        timeout: 3,
        hints: 'yes, no',
    });

    twiml.redirect('./registration2');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationNameResponse(twiml, request) {
    if (!request.body.SpeechResult.toLowerCase().includes('yes')) {
        registrationFail(twiml);
        return;
    }

    twiml.say("Great. It looks like you're trying to renew your registration. I'll need three things from you: Your registration ID, your registration office address, and the date of your last renewal.");
    const gatherNode = twiml.gather({
        input: 'dtmf',
        action: '/registration-id-response',
        numDigits: 5,
        timeout: 10,
    });
    gatherNode.say('First, key in your 5 digit registration ID.');
    twiml.redirect('/registration-incorrect');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationIdResponse(twiml, request) {
    if (request.body.Digits != getRegistrationId(request)) {
        registrationIncorrect(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        action: '/registration-address-response',
        numDigits: 5,
        timeout: 10,
    });
    gatherNode.say('Ok. Now key in the 5 digit postal code for the registration office.');
    twiml.redirect('/registration-incorrect');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationAddressResponse(twiml, request) {
    if (request.body.Digits != getRegistrationPostalCode(request)) {
        registrationIncorrect(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        action: '/registration-date-response',
        numDigits: 8,
        timeout: 10,
    });
    gatherNode.say('Ok. Now key in the date of your last renewal. First enter the year, then the month, then the day.');
    twiml.redirect('/registration-incorrect');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationDateResponse(twiml, request) {
    if (request.body.Digits != getRegistrationDate(request)) {
        registrationIncorrect(twiml);
        return;
    }

    twiml.say("Alright, that all looks correct! Your registration is now renewed. Before you leave, can you rate your customer experience today?");

    const gatherNode = twiml.gather({
        input: 'dtmf',
        action: '/registration-rating-response',
        numDigits: 1,
        timeout: 5,
    });
    gatherNode.say('Please enter a number from 1 to 5.');
    twiml.redirect('/registration-rating-response');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationRatingResponse(twiml, request) {
    // TODO: Kill the AI!!
    // Also log the response?

    twiml.say('Thank you for your rating.');
    twiml.pause();

    // twiml.say('Congrations, you have killed the automated voice service!');
    // twiml.pause();

    twiml.say("This was Phone Tree of Despair, a game made for Ludum Dare 47. I hope you enjoyed it! I'm Jez Swanson, known as jezzamonn on twitter. If you entered Ludum Dare, please give the game a rating on the Ludum Dare website. You can find the link at jezzamon dot itch dot io. Congrats again on winning! Good bye!");
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function registrationIncorrect(twiml) {
    twiml.say("Sorry, that doesn't look correct. If you need to look up information about your registration, try contacting the other departments. You can find their extension codes by accessing the extension directory by pressing 1 2 3 at the main menu. I'll transfer you there now.");
    twiml.redirect('/entry');
}

/**
 * @param {VoiceResponse} twiml
 */
function registrationFail(twiml) {
    twiml.say('Sorry about that. Please hold');
    hold(twiml);
};

module.exports = {
    registration,
    registrationNameResponse,
    registrationIdResponse,
    registrationAddressResponse,
    registrationDateResponse,
    registrationRatingResponse,
    registrationIncorrect,
    registrationFail,
};
