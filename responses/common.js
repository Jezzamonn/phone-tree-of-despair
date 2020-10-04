const VoiceResponse = require('twilio').twiml.VoiceResponse;

function handleRequest(fn) {
    return (request, response) => {
        const twiml = new VoiceResponse();

        fn(twiml, request, response);

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

module.exports = {
    handleRequest,
    hold,
    playSound,
};
