const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * Handles a request from twilio
 */
function handleRequest(fn) {
    return (request, response) => {
        const twiml = new VoiceResponse();

        const digits = request.body.Digits || '';
        const speech = (request.body.SpeechResult || '').toLowerCase();

        fn(twiml, {digits: digits, speech: speech});

        response.type('text/xml');
        response.send(twiml.toString());
    }
}

/**
 * @param {VoiceResponse} twiml
 */
function playSound(twiml, path) {
    const fullPath = 'https://storage.googleapis.com/stellar-ether-198321.appspot.com/' + path;
    twiml.play(fullPath);
}

/**
 * @param {VoiceResponse} twiml
 */
function hold(twiml) {
    playSound(twiml, 'please-hold-mangled.mp3');
}

/**
 * @param {Request} request
 */
function getSpeechAnswer(request) {
    return (request.body.SpeechResult || '').toLowerCase();
}

module.exports = {
    handleRequest,
    hold,
    playSound,
    getSpeechAnswer,
};
