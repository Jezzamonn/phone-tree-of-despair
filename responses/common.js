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
function hold(twiml) {
    twiml.play('https://demo.twilio.com/docs/classic.mp3');
}

module.exports = {
    handleRequest,
    hold,
};
