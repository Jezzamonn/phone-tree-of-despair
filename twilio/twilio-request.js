const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * Handles a request from twilio
 */
function handleRequest(fn) {
    return (request, response) => {
        const digits = request.body.Digits || '';
        const speech = (request.body.SpeechResult || '').toLowerCase();

        const actionList = fn({digits: digits, speech: speech});

        const twiml = new VoiceResponse();
        setVoiceResponse(twiml, actionList);

        response.type('text/xml');
        response.send(twiml.toString());
    }
}

function setVoiceResponse(twiml, actionList) {
    for (const action of actionList.actions) {
        switch (action.type) {
            case 'say':
                if (action.voice != '') {
                    twiml.say({voice: action.voice}, action.text);
                }
                else {
                    twiml.say(action.text);
                }
                break;
            case 'play':
                const basePath = 'https://storage.googleapis.com/stellar-ether-198321.appspot.com/'
                const fullPath = basePath + action.soundPath;
                twiml.play(fullPath);
                break;
            case 'getSpeech':
                const speechNode = twiml.gather({
                    input: 'speech',
                    action: action.responseDestination,
                    hints: action.hints.join(','),
                    timeout: action.timeout,
                });
                if (action.whileWaiting) {
                    setVoiceResponse(speechNode, action.whileWaiting);
                }
                break;
            case 'getDigits':
                const digitsNode = twiml.gather({
                    input: 'dtmf',
                    action: action.responseDestination,
                    numDigits: action.numDigits,
                    timeout: action.timeout,
                });
                if (action.whileWaiting) {
                    setVoiceResponse(digitsNode, action.whileWaiting);
                }
                break;
            case 'redirect':
                twiml.redirect(action.destination)
                break;
            case 'pause':
                twiml.pause();
                break;
        }
    }

    return twiml;
}

module.exports = {
    handleRequest,
};