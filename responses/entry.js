const VoiceResponse = require('twilio').twiml.VoiceResponse;

const handleEntry = (request, response) => {
    const twiml = new VoiceResponse();

    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 3,
        action: '/check-extension',
    });
    gatherNode.say('Thank you for calling the Phone Tree of Despair. Your call is so, so, important to us.');
    gatherNode.pause();
    gatherNode.say('If you have an extension code, enter it now. ' + 'Otherwise, stay on the line for more information.');

    twiml.redirect('/more-info');

    response.type('text/xml');
    response.send(twiml.toString());
}

module.exports = {
    handleEntry
};